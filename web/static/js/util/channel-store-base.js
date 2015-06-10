/* global Immutable */
/* global inflection */
/* global uuid */


function makeRef() {
  return uuid.v1();
}

class Request extends Immutable.Record({ref: null, type: null, item: null}) {
  constructor(attributes) {
    attributes.ref = makeRef();
    super(attributes);
  }
}

let _channel = null;

function assertChannelConnected(name) {
  if (_channel === null) {
    throw {message: `channel must be connected for '${name}'.`};
  }
}

class ChannelStoreBase {
  get collectionName()       { throw "ChannelStoreBase: collectionName getter not implemented"; }
  get model()                { throw "ChannelStoreBase: model getter not implemented"; }
  triggerItemAdded(item)     { throw "ChannelStoreBase: triggerItemAdded method not implemented"; }
  triggerItemUpdated(item)   { throw "ChannelStoreBase: triggerItemUpdated method not implemented"; }
  triggerItemDeleted(item)   { throw "ChannelStoreBase: triggerItemDeleted method not implemented"; }
  triggerError(errorMessage) { throw "ChannelStoreBase: triggerError method not implemented"; }

  get modelName() { return inflection.singularize(this.collectionName); }

  constructor() {
    this.ref = makeRef();
  }

  join(settings) {
    if (!settings.socket)   { throw "connect: missing socket"; }
    if (!settings.subtopic) { throw "connect: missing subtopic"; }
    if (_channel) { _channel.disconnect(); }

    let topic = `${this.collectionName}:${settings.subtopic}`;
    function errorReporter(kind) {
      return function () {
        let message = `connect: joining ${topic} store failed [${kind}].`;
        throw message;
      };
    }
    _channel = settings.socket.chan(topic, {token: settings.token || {}});
    _channel
      .join()
      .receive("ok", () => this._listenForItemEvents())
      .receive("error", errorReporter("error"))
      .receive("ignore", errorReporter("ignore"));
  }

  addItem(item) {
    assertChannelConnected('addItem');
    setTimeout(() => this.triggerItemAdded(item), 0);
    let request = new Request({type: 'add', item: item});
    this._submitRequest(request)
      .then(({attributes}) => {
        if (request.item.id !== attributes.id) {
          setTimeout(() => this.triggerItemDeleted(request.item), 0);
        }
        let itemCreated = new this.model(attributes);
        setTimeout(() => this.triggerItemAdded(itemCreated), 0);
      })
      .catch(({errors}) => {
        setTimeout(() => this.triggerItemDeleted(request.item), 0);
        this._triggerError(errors);
      });
  }

  updateItem(item, changes) {
    assertChannelConnected('updateItem');
    let updatedItem = item.merge(changes);
    setTimeout(() => this.triggerItemUpdated(updatedItem), 0);
    let request = new Request({type: 'update', item: updatedItem});
    this._submitRequest(request)
      .catch(({errors, attributes}) => {
        let currentItem = new this.model(attributes);
        setTimeout(() => this.triggerItemUpdated(currentItem), 0);
        this._triggerError(errors);
      });
  }

  deleteItem(item) {
    assertChannelConnected('deleteItem');
    setTimeout(() => this.triggerItemDeleted(item), 0);
    let request = new Request({type: 'delete', item: item});
    this._submitRequest(request)
      .catch(({errors}) => {
        setTimeout(() => this.triggerItemAdded(request.item), 0);
        this._triggerError(errors);
      });
  }

  _listenForItemEvents() {
    assertChannelConnected('_listenForItemEvents');
    _channel.on('added', this._itemAdded.bind(this));
    _channel.on('updated', this._itemUpdated.bind(this));
    _channel.on('deleted', this._itemDeleted.bind(this));
  }

  _itemAdded(payload) {
    if (payload.from !== this.ref) {
      let item = new this.model(payload.attributes);
      this.triggerItemAdded(item);
    }
  }

  _itemUpdated(payload) {
    if (payload.from !== this.ref) {
      let item = new this.model(payload.attributes);
      this.triggerItemUpdated(item);
    }
  }

  _itemDeleted(payload) {
    if (payload.from !== this.ref) {
      let item = new this.model(payload.attributes);
      this.triggerItemDeleted(item);
    }
  }

  _submitRequest(request) {
    return new Promise((resolve, reject) => {
      let payload = {from: this.ref, ref: request.ref, attributes: request.item.toObject()};
      _channel.push(request.type, payload).receive('ok', resolve).receive('error', reject)
    });
  }

  _triggerError(errors) {
    function format(name, messages) {
      return messages.map(message => `${name} ${message}`).join(', ');
    }
    let message = Object.keys(errors).reduce(function(messages, name) {
      return messages.concat(format(name, errors[name]));
    }, []);
    this.triggerError(message.join(', '));
  }
}

export default ChannelStoreBase;

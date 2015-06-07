/* global Immutable */
/* global inflection */
/* global uuid */

class Request extends Immutable.Record({ref: null, type: null, item: null}) {
  constructor(attributes) {
    attributes.ref = uuid.v1();
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
  triggerItemDeleted(item)   { throw "ChannelStoreBase: triggerItemDeleted method not implemented"; }
  triggerError(errorMessage) { throw "ChannelStoreBase: triggerError method not implemented"; }

  get modelName() { return inflection.singularize(this.collectionName); }

  connect(settings) {
    if (!settings.socket) { throw "connect: missing socket"; }
    if (_channel) { _channel.disconnect(); }

    let storeName = `${this.collectionName}:store`;
    function errorReporter(kind) {
      return function () {
        let message = `connect: joining ${storeName} store failed [${kind}].`;
        throw message;
      };
    }
    _channel = settings.socket.chan(storeName, {token: settings.token || {}});
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

  deleteItem(item) {
    assertChannelConnected('deleteItem');
    setTimeout(() => this.triggerItemDeleted(item), 0);
    let request = new Request({type: 'delete', item: item});
    this._submitRequest(request)
      .then(() => console.log('deleteItem: OK'))
      .catch(({errors}) => {
        setTimeout(() => this.triggerItemAdded(request.item), 0);
        this._triggerError(errors);
      });
  }

  _listenForItemEvents() {
    assertChannelConnected('_listenForItemEvents');
    _channel.on('added', payload => this._itemAdded(payload));
    _channel.on('deleted', payload => this._itemDeleted(payload));
  }

  _itemAdded(payload) {
    console.log('_itemAdded:', payload);
    // if (payload.ref) {
    //   let payloadToDelete = Object.assign({}, payload);
    //   setTimeout(() => this.triggerItemDeleted(payloadToDelete), 0);
    //   this.pending = this.pending.remove(payload.ref);
    //   delete payload.ref;
    // }
    // setTimeout(() => this.triggerItemAdded(payload), 0);
  }

  _itemDeleted(payload) {
    console.log('_itemDeleted:', payload);
    // let attributes = payload[this.modelName],
    //     id = attributes && attributes.id;

    // id = id || payload.ref;
    // if (id) {
    //   this.triggerItemDeleted(payload);
    //   this.pending = this.pending.remove(id);
    // }
  }

  _submitRequest(request) {
    console.log('_submitRequest:', request);
    return new Promise(function (resolve, reject) {
      _channel.push(request.type, {ref: request.ref, attributes: request.item.toObject()})
        .receive('ok',    response => resolve(response))
        .receive('error', response => reject(response));
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

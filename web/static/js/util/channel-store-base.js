/* global Immutable */
/* global inflection */
let Operation = Immutable.Record({type: null, item: null});

let _channel = null;

function assertChannelConnected(name) {
  if (_channel === null) {
    throw {message: `channel must be connected for '${name}'.`};
  }
}

class ChannelStoreBase {
  get collectionName()       { throw "ChannelStoreBase: collectionName getter not implemented"; }
  triggerItemAdded(item)     { throw "ChannelStoreBase: triggerItemAdded method not implemented"; }
  triggerItemDeleted(item)   { throw "ChannelStoreBase: triggerItemDeleted method not implemented"; }
  triggerError(errorMessage) { throw "ChannelStoreBase: triggerError method not implemented"; }

  constructor() {
    this.pending = Immutable.Map();
  }

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
    this._executeOperation('add', item, payload => this._processEvent('delete', payload));
    setTimeout(() => this.triggerItemAdded(item), 0);
  }

  deleteItem(item) {
    assertChannelConnected('deleteItem');
    if (item) {
      setTimeout(() => this.triggerItemDeleted(item), 0);
      this._executeOperation('delete', item, payload => {
        this._processEvent('add', {ref: item.id, [this.modelName]: item.toJSON()});
      });
    }
    return item;
  }

  _listenForItemEvents() {
    assertChannelConnected('_listenForItemEvents');
    _channel.on('added', payload => this._itemAdded(payload));
    _channel.on('deleted', payload => this._itemDeleted(payload));
  }

  _itemAdded(payload) {
    console.log('_itemAdded:', payload);
    if (payload.ref) {
      let payloadToDelete = Object.assign({}, payload);
      setTimeout(() => this.triggerItemDeleted(payloadToDelete), 0);
      this.pending = this.pending.remove(payload.ref);
      delete payload.ref;
    }
    setTimeout(() => this.triggerItemAdded(payload), 0);
  }

  _itemDeleted(payload) {
    console.log('_itemDeleted:', payload);
    let attributes = payload[this.modelName],
        id = attributes && attributes.id;

    id = id || payload.ref;
    if (id) {
      this.triggerItemDeleted(payload);
      this.pending = this.pending.remove(id);
    }
  }

  _executeOperation(type, item, onError = function () {}) {
    console.log('_executeOperation:', type, item);
    let operation = new Operation({type, item: item});
    this.pending = this.pending.set(item.id, operation);
    this._itemAdded(item);
    _channel.push(type, {ref: item.id, attributes: item.toObject()})
      .receive('ok', payload => this._processEvent(type, payload))
      .receive('error', onError);
  }

  _processEvent(type, payload) {
    console.log('_processEvent:', type, payload);
    if (payload.errors) {
      this._triggerError(payload.errors);
    }
    switch (type) {
      case 'add':
        this._itemAdded(payload);
        break;
      case 'delete':
        this._itemDeleted(payload);
        break;
    }
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

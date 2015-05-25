/* global Immutable */
/* global inflection */
/* global uuid */

let Operation = Immutable.Record({type: null, id: null});

function connectChannelMixin(collectionName, modelType) {
  let _channel = null;
  let _modelName = inflection.singularize(collectionName);

  function assertChannelConnected(name) {
    if (_channel === null) {
      throw {message: `channel must be connected for '${name}'.`};
    }
  }

  function makeItem(attributes, extra = {}) {
    let properties = Object.assign({}, extra, attributes);
    return new modelType(properties);
  }

  return {
    init() {
      this.collection = Immutable.Map();
      this.pending= Immutable.Map();
    },

    setSocket(socket) {
      if (_channel) {
        _channel.disconnect();
      }

      _channel = socket.chan(`${collectionName}:store`, {});
      _channel
        .join()
        .receive("ok", () => this._listenForItemEvents())
        .receive("error", () => _channel = null)
        .receive("ignore", () => _channel = null);
    },

    pushPayload(payload) {
      let items = payload[collectionName];

      if (items) {
        this.collection = items.reduce(function(map, attributes) {
          return map.set(attributes.id, makeItem(attributes));
        }, this.collection);
        this.trigger(this.collection);
      }
    },

    addItem(attributes) {
      assertChannelConnected('addItem');
      let item = makeItem(attributes, {id: uuid.v1()});
      this.collection = this.collection.set(item.id, item);
      this.trigger(this.collection);
      this._executeOperation('add', item);
      return item;
    },

    _executeOperation(type, item) {
      let operation = new Operation({type, id: item.id});
      this.pending = this.pending.set(item.id, operation);
      _channel.push(type, {ref: item.id, attributes: item.toJS()})
        .receive('ok', payload => this._processEvent(type, payload))
        .receive('error', payload => this._processEvent('del', payload))
    },

    _processEvent(type, payload) {
      switch (type) {
        case 'add':
          this._itemAdded(payload);
          break;
        case 'del':
          this._itemDeleted(payload);
          break;
      }
    },

    _itemAdded(payload) {
      let ref = payload.ref;
      let item = makeItem(payload[_modelName]);

      if (ref) {
        this.collection = this.collection.remove(ref);
        this.pending = this.pending.remove(ref);
      }
      this.collection = this.collection.set(item.id, item);
      this.trigger(this.collection);
    },

    _itemDeleted(payload) {
      let attributes = payload[_modelName],
          id = attributes && attributes.id;

      id = id || payload.ref;;
      if (id) {
        this.collection = this.collection.remove(id);
        this.pending = this.pending.remove(id);
        this.trigger(this.collection);
      }
    },

    _listenForItemEvents() {
      assertChannelConnected('_listenForItemEvents');
      _channel
        .on('added', payload => this._itemAdded(payload))
        .on('deleted', payload => this._itemDeleted(payload));
    }
  };
}

export default {connectChannelMixin};

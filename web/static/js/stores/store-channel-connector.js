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
        .receive("ok", () => console.log("setup channel listeners"))
        .receive("error", () => binding.channel = null)
        .receive("ignore", () => binding.channel = null);
    },

    pushPayload(payload) {
      let items = payload[collectionName];

      if (items) {
        this.collection = items.reduce(function(map, attributes) {
          return map.set(attributes.id, makeItem(attributes));
        }, this.collection);
      }
    },

    addItem(attributes) {
      assertChannelConnected('addItem');
      let item = makeItem(attributes, {id: uuid.v1()});
      this.collection = this.collection.set(item.id, item);
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
      let ref = payload.ref, attributes = payload[_modelName];

      switch (type) {
        case 'add':
          this._itemAdded(ref, attributes);
          break;
        case 'del':
          this._itemDeleted(ref);
          break;
      }
    },

    _itemAdded(ref, attributes) {
      let item = makeItem(attributes);
      if (ref) {
        this.collection = this.collection.remove(ref);
        this.pending = this.pending.remove(ref);
      }
      this.collection = this.collection.set(item.id, item);
    },

    _itemDeleted(id) {
      if (id) {
        this.collection = this.collection.remove(id);
        this.pending = this.pending.remove(id);
      }
    }
  };
}

export default {connectChannelMixin};

/* global Immutable */
/* global uuid */

let Operation = Immutable.Record({type: null, id: null});


function connectChannelMixin(collectionName, modelType) {
  let _channel = null;

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
      _channel.push(type, {ref: item.id, attributes: item.toJS()});
    }
  };
}

export default {connectChannelMixin};

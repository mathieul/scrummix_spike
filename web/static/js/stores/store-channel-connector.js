/* global Immutable */
/* global uuid */

let Operation = Immutable.Record({type: null, id: null});

function initFactory(binding) {
  return function () {
    binding.channel = null;
    this.collection = Immutable.Map();
    this.pending= Immutable.Map();
  };
}

function setSocketFactory(binding, name) {
  return function(socket) {
    if (binding.channel) {
      binding.channel.disconnect();
    }

    binding.channel = socket.chan(name, {});
    binding.channel
      .join()
      .receive("ok", () => console.log("setup channel listeners"))
      .receive("error", () => binding.channel = null)
      .receive("ignore", () => binding.channel = null);
  };
}

function pushPayloadFactory(binding) {
  return function (payload) {
    let items = payload[binding.collectionName];

    if (items) {
      this.collection = items.reduce(function(map, attributes) {
        return map.set(attributes.id, makeItem(binding, attributes));
      }, this.collection);
    }
  };
}

function makeItem(binding, attributes) {
  let item = new binding.modelType(attributes);
  return item;
}

function addItemFactory(binding) {
  return function (attributes) {
    let id = uuid.v1();
    attributes = Object.assign({}, {id}, attributes);
    let item = new binding.modelType(attributes);
    this.collection = this.collection.set(item.transactionId, item);
    let operation = new Operation({type: 'add', id: id});
    this.pending = this.pending.set(id, operation);
    return item;
  };
}

export default {
  connectChannelMixin: function (collectionName, modelType) {
    let binding = {collectionName: collectionName, modelType: modelType};

    return {
      init:        initFactory(binding),
      setSocket:   setSocketFactory(binding, `${collectionName}:store`),
      pushPayload: pushPayloadFactory(binding),
      addItem:     addItemFactory(binding)
    };
  }
};

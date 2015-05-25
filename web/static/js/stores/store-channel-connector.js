/* global Immutable */
/* global uuid */

let Operation = Immutable.Record({type: null, id: null});

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

function initFactory(binding) {
  return function () {
    binding.channel = null;
    binding.collection = Immutable.Map();
    binding.pending= Immutable.Map();
  };
}

function pushPayloadFactory(binding) {
  return function (payload) {
    let items = payload[binding.collectionName];

    if (items) {
      binding.collection = items.reduce(function(map, attributes) {
        return map.set(attributes.id, makeItem(binding, attributes));
      }, Immutable.Map());
    }
  };
}

function makeItem(binding, attributes) {
  let item = new binding.modelType(attributes);
  return item;
}

function addItemFactory(binding) {
  return function (attributes) {
    let id = uuid.v1()
    attributes = Object.assign({}, {id}, attributes);
    let item = new binding.modelType(attributes);
    binding.collection = binding.collection.set(item.transactionId, item);
    let operation = new Operation({type: 'add', id: id});
    binding.pending = binding.pending.set(id, operation);
    return item;
  };
}

export default {
  connectChannelMixin: function (collectionName, modelType) {
    let binding = {collectionName: collectionName, modelType: modelType};

    return {
      init:        initFactory(binding),
      collection:  function () { return binding.collection; },
      pending:     function () { return binding.pending; },
      setSocket:   setSocketFactory(binding, `${collectionName}:store`),
      pushPayload: pushPayloadFactory(binding),
      addItem:     addItemFactory(binding)
    };
  }
};

/* global Immutable */

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
  };
}

function pushPayloadFactory(binding) {
  return function (payload) {
    let items = payload[binding.collectionName];
    let type = binding.modelType;

    if (items) {
      binding.collection = items.reduce(function(map, item) {
        return map.set(item.id, new type(item));
      }, Immutable.Map());
    }
  };
}

export default {
  connectChannelMixin: function (collectionName, modelType) {
    let binding = {collectionName: collectionName, modelType: modelType};

    return {
      init:        initFactory(binding),
      collection:  function () { return binding.collection; },
      setSocket:   setSocketFactory(binding, `${collectionName}:store`),
      pushPayload: pushPayloadFactory(binding)
    };
  }
};

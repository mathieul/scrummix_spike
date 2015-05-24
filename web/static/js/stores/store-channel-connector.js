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
    binding.collection = Immutable.List();
  };
}

function pushPayloadFactory(binding) {
  return function (payload) {
    let items = payload[binding.collectionName];

    if (items) {
      binding.collection = items.reduce(function(list, item) {
        return list.push(item);
      }, Immutable.List());
    }
  };
}

export default {
  connectChannelMixin: function (collectionName) {
    let binding = {collectionName: collectionName};

    return {
      init:       initFactory(binding),
      collection: function () { return binding.collection; },
      setSocket:  setSocketFactory(binding, `${collectionName}:store`),
      pushPayload: pushPayloadFactory(binding)
    };
  }
};

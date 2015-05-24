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

export default {
  connectChannelMixin: function (collectionName) {
    let binding = {channel: null};

    return {
      setSocket: setSocketFactory(binding, `${collectionName}:store`)
    };
  }
};

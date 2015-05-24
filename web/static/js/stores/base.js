/* global Reflux */

export default {
  createStore: function (collectionName, modelName, properties) {
    let _channelName = `${collectionName}:store`;
    let _channel = null;

    properties = Object.assign({}, properties, {
      setSocket: function (socket) {
        if (_channel) {
          _channel.disconnect();
        }

        _channel = socket.chan(_channelName, {});
        _channel
          .join()
          .receive("ok", () => console.log("setup channel listeneres"))
          .receive("error", () => _channel = null)
          .receive("ignore", () => _channel = null);
      }
    });
    return Reflux.createStore(properties);
  }
};

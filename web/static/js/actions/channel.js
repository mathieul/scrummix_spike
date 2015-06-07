import alt from '../util/alt';

class ChannelActions {
  connect(settings) {
    this.dispatch(settings);
  }
}

export default alt.createActions(ChannelActions);

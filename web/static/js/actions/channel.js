import alt from '../util/alt';

class ChannelActions {
  join(settings) {
    this.dispatch(settings);
  }
}

export default alt.createActions(ChannelActions);

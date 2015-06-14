import alt from '../util/alt';
import ChannelStoreBase from '../util/channel-store-base';
import Section from '../models/section';
import SectionActions from '../actions/section';
import ChannelActions from '../actions/channel';

class SectionChannelStore extends ChannelStoreBase {
  get collectionName()          { return 'sections'; }
  get model()                   { return Section; }
  triggerItemsFetched(sections) { SectionActions.setSections(sections); }
  triggerError(errorMessage)    { SectionActions.errorChanged(errorMessage); }

  constructor() {
    super();

    this.bindListeners({
      join:        ChannelActions.JOIN,
      handleFetch: SectionActions.FETCH_SECTIONS
    });
  }

  handleFetch(sections) {
    this.fetchItems();
  }
}

export default alt.createStore(SectionChannelStore, 'SectionChannelStore');

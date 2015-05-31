import alt from '../util/alt';

class SectionActions {
  setSections(sections) {
    this.dispatch(sections);
  }

  fetchSectionsFailed(message) {
    this.dispatch(message);
  }
}

export default alt.createActions(SectionActions);

import alt from '../util/alt';

class SectionActions {
  fetchSections() {
    this.dispatch();
  }

  setSections(sections) {
    this.dispatch(sections);
  }

  errorChanged(errorMessage) {
    this.dispatch(errorMessage);
  }
}

export default alt.createActions(SectionActions);

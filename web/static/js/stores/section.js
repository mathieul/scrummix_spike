import alt from '../util/alt';
import SectionActions from "../actions/section";

class SectionStore {
  constructor() {
    this.sections = Immutable.Map();
    this.bindListeners({
      handleSetSections: SectionActions.SET_SECTIONS
    });
  }

  static setFilter(filter) {
    this._filter = filter;
  }

  handleSetSections(sections) {
    let filter = this.getInstance()._filter;
    this.errorMessage = null;
    this.sections = filter ? sections.filter(filter) : sections;
  }
}

export default alt.createStore(SectionStore, 'SectionStore');

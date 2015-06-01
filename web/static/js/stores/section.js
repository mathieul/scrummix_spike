import alt from '../util/alt';
import SectionSource from '../sources/section';
import Section from '../models/section';
import SectionActions from "../actions/section";

class SectionStore {
  constructor() {
    this.sections = Immutable.Map();
    this.bindListeners({
      handleSetSections: SectionActions.SET_SECTIONS,
      handleFetchSectionsFailed: SectionActions.FETCH_SECTIONS_FAILED
    });
    this.exportAsync(SectionSource);
  }

  static setFilter(filter) {
    this._filter = filter;
  }

  handleSetSections(sections) {
    let filter = this.getInstance()._filter;
    this.errorMessage = null;
    this.sections = filter ? sections.filter(filter) : sections;
  }

  handleFetchSectionsFailed(message) {
    this.errorMessage = message;
  }
}

export default alt.createStore(SectionStore, 'SectionStore');

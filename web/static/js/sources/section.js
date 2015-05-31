import Section from '../models/section';
import SectionActions from "../actions/section";

export default {
  fetchSections: {
    remote() {
      return new Promise(function (resolve, reject) {
        if (false) {
          reject("Testing error message");
        } else {
          let sectionMap = Scrummix.sections.sections.reduce(function (map, attributes) {
            return map.set(attributes.id, new Section(attributes));
          }, Immutable.Map());
          console.log('SECTIONS LOADED:', sectionMap);
          resolve(sectionMap);
        }
      });
    },

    success: SectionActions.setSections,
    error:   SectionActions.fetchSectionsFailed
  }
};

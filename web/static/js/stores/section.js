import SectionActions from "../actions/section";
import StoreChannelConnector from "./store-channel-connector";
/* global Immutable */
/* global Reflux */
/* global Scrummix */
/* global uuid */

let PUSH_TIMEOUT = 5 * 1000;

let SectionModel = Immutable.Record({id: null, label: null, color: null, position: 0});

export default Reflux.createStore({
  listenables: [SectionActions],
  mixis: [StoreChannelConnector.connectChannelMixin('sections', SectionModel)],

  getInitialState() {
    return this.section;
  },

  onAddTask(label, section) {
    this.addItem({
      label: label,
      position: 1, // TODO: figure out position in model, pass operation instead (append, prepend, etc...)
      section_id: section.id
    });
  },

  onDelTask(target, section) {
    if (!_channel) { return; }

    this.delItem(target.id);
  }
});

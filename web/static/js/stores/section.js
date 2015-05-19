import ActionTasks from "../actions/tasks";
/* global Reflux */
/* global Scrummix */

export default Reflux.createStore({
  listenables: [ActionTasks],

  init() {
    this.section = Scrummix.section.section;
  },

  getInitialState() {
    return this.section;
  },

  onAddTask(label) {
    let task = {id: (new Date()).getTime(), label: label, position: 1, completed_at: null};
    this.section.tasks.push(task);
    this.trigger(this.section);
  }
});

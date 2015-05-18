import ActionsTasks from "../actions/tasks";
/* global Reflux */

export default Reflux.createStore({
  listenables: [ActionsTasks],

  onAddTask(label, section) {
    let task = {id: 42, label: label, position: 1, completed_at: null};
    section.tasks.push(task);
    this.trigger("this is just some test");
  }
});

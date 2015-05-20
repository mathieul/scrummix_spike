import ActionTasks from "../actions/tasks";
/* global Reflux */
/* global Scrummix */

let _channel = null;

export default Reflux.createStore({
  listenables: [ActionTasks],

  init() {
    this.section = Scrummix.section.section;
  },

  getInitialState() {
    return this.section;
  },

  set socket(socket) {
    if (_channel) {
      _channel.disconnect();
    }
    _channel = socket.join('sections:store', {});

    setTimeout(function () {
      _channel.on("ping", function (payload) { console.log("ping -->", payload) });
      _channel.on("front_msg", function (payload) { console.log("front_msg -->", payload) });
      _channel.push("front_msg", {body: "testing push from front-end"});
    }, 0);
  },

  onAddTask(label) {
    let task = {id: (new Date()).getTime(), label: label, position: 1, completed_at: null};
    this.section.tasks.push(task);
    this.trigger(this.section);
  }
});

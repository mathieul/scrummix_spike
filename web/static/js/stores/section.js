import ActionTasks from "../actions/tasks";
/* global Reflux */
/* global Scrummix */
/* global uuid */

let _channel = null;
let PUSH_TIMEOUT = 5 * 1000;

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

    _channel = socket.chan("sections:store", {token: "todo-channel-token"});
    _channel
      .join()
      .receive("ok", ({messages}) => this.listenToChannel(_channel))
      .receive("error", chan => {
        _channel = null;
        console.log("TODO>>> CHANNEL ERROR --> ", chan);
      })
      .receive("ignore", chan => {
        _channel = null;
        console.log("TODO>>> CHANNEL IGNORE --> ", chan);
      });
  },

  listenToChannel(channel) {
    this.handleTaskAdded(channel);
  },

  handleTaskAdded(channel) {
    channel.on("task_added", payload => {
      console.log("LOG>>> task_added: ", payload);
      this.addTask(payload);
    });
  },

  addTask(task) {
    this.section.tasks.push(task);
    this.trigger(this.section);
  },

  onAddTask(label, section) {
    console.log(`TODO>>> should send request to add task "${label}" to section #${section.id} (this = ${this.section.id})`);
    if (!_channel) { return; }

    let task = {
      label: label,
      position: 1, // TODO: figure out position in model, pass operation instead (append, prepend, etc...)
      section_id: section.id
    };
    let ref = uuid.v1();
    this.addTask(task);
    _channel.push("add_task", {ref: ref, task: task})
      .receive("ok", payload => console.log("OK: add_task succeeded: ", payload.ref))
      .receive("error", reason => {
        console.log("ERROR: add_task failed: ", reason);
        // TODO: remove the task using ref
      })
      .after(PUSH_TIMEOUT, () => console.log("ERROR: add_task timeout!"));
  }

  // listenToChannel(channel) {
  //   channel.on("front_msg", function (payload) { console.log("front_msg -->", payload) });
  //   channel.push("front_msg", {body: "testing push from front-end"});

  //   channel.on("broad_msg", function (payload) { console.log("broad_msg -->", payload) });
  // },
});

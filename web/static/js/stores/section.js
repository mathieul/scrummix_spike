import SectionActions from "../actions/section";
/* global Reflux */
/* global Scrummix */
/* global uuid */

let _channel = null;
let PUSH_TIMEOUT = 5 * 1000;

export default Reflux.createStore({
  listenables: [SectionActions],

  init() {
    this.section = Scrummix.section.section;
  },

  getInitialState() {
    return this.section;
  },

  get socket() {
    return null;
  },

  set socket(socket) {
    if (_channel) {
      _channel.disconnect();
    }

    _channel = socket.chan("sections:store", {token: "todo-channel-token"});
    _channel
      .join()
      .receive("ok", () => this.listenToChannel(_channel))
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

  addTask(task, section) {
    section.tasks.push(task);
    this.trigger(section);
  },

  onAddTask(label, section) {
    if (!_channel) { return; }

    let task = {
      label: label,
      position: 1, // TODO: figure out position in model, pass operation instead (append, prepend, etc...)
      section_id: section.id
    };
    let ref = uuid.v1();
    this.addTask(Object.assign({}, task, {ref: ref}), section);
    _channel.push("add_task", {ref: ref, task: task})
      .receive("ok", payload => console.log("OK: add_task succeeded: ", payload.ref))
      .receive("error", reason => {
        console.log("ERROR: add_task failed: ", reason);
        if (this.delTask(task, section, task => task.ref === ref)) {
          // TODO: show notification that adding the task failed
        }
      })
      .after(PUSH_TIMEOUT, () => console.log("ERROR: add_task timeout!"));
  },

  delTask(target, section, filterFunc) {
    let index = section.tasks.findIndex(filterFunc);
    let deleted = false;

    if (index !== -1) {
      section.tasks.splice(index, 1);
      this.trigger(section);
      deleted = true;
    }

    return deleted;
  },

  onDelTask(target, section) {
    if (!_channel) { return; }

    this.delTask(target, section, task => task.id === target.id);
    _channel.push("del_task", {task_id: target.id})
      .receive("ok", _payload => console.log("OK: del_task succeeded"))
      .receive("error", reason => console.log("ERROR: del_task failed: ", reason))
      .after(PUSH_TIMEOUT, () => console.log("ERROR: del_task timeout!"));
  }
});

import alt from '../util/alt';
import Task from '../models/task';
import TaskActions from "../actions/task";

/* global Immutable */
/* global inflection */
/* global uuid */
let Operation = Immutable.Record({type: null, id: null});

let _channel = null;

function assertChannelConnected(name) {
  if (_channel === null) {
    throw {message: `channel must be connected for '${name}'.`};
  }
}

class ChannelStoreBase {
  constructor() {
    this.pending = Immutable.Map();
  }

  get collectionName() { throw "ChannelStoreBase: collectionName getter not implemented"; }
  get modelName()      { return inflection.singularize(this.collectionName); }

  setSocket(socket) {
    if (_channel) {
      _channel.disconnect();
    }

    _channel = socket.chan(`${this.collectionName}:store`, {token: "todo-task-token"});
    _channel
      .join()
      .receive("ok", () => this.listenForItemEvents())
      .receive("error", () => _channel = null)
      .receive("ignore", () => _channel = null);
  }

  addItem(attributes) {
    assertChannelConnected('addItem');
    let id = uuid.v1();
    let itemAttributes = Object.assign({id: uuid.v1()}, attributes);
    console.log('addItem:', itemAttributes);
    setTimeout(() => TaskActions.taskAdded(itemAttributes), 0);
    this.executeOperation('add', itemAttributes, payload => this.processEvent('del', payload));
  }

  deleteItem(id) {
    assertChannelConnected('addItem');
    id = typeof id === 'object' ? id.id : id;
    if (item) {
      TaskActions.taskDeleted(id);
      this._executeOperation('del', item, payload => {
        this._processEvent('add', {ref: item.id, [this.modelName]: item.toJSON()});
      });
    }
    return item;
  }

  listenForItemEvents() {
    assertChannelConnected('listenForItemEvents');
    _channel.on('added', payload => this.itemAdded(payload));
    _channel.on('deleted', payload => this.itemDeleted(payload));
  }

  itemAdded(payload) {
    console.log('itemAdded:', payload);
    if (payload.ref) {
      TaskActions.taskDeleted(payload.ref);
      this.pending = this.pending.remove(payload.ref);
    }
    TaskActions.taskAdded(payload);
  }

  itemDeleted(payload) {
    console.log('itemDeleted:', payload);
    let attributes = payload[this.modelName],
        id = attributes && attributes.id;

    id = id || payload.ref;
    if (id) {
      TaskActions.taskDeleted(id);
      this.pending = this.pending.remove(id);
    }
  }

  executeOperation(type, attributes, onError = function () {}) {
    let operation = new Operation({type, id: attributes.id});
    this.pending = this.pending.set(attributes.id, operation);
    _channel.push(type, {ref: attributes.id, attributes: attributes})
      .receive('ok', payload => this.processEvent(type, payload))
      .receive('error', onError);
  }

  processEvent(type, payload) {
    switch (type) {
      case 'add':
        this.itemAdded(payload);
        break;
      case 'del':
        this.itemDeleted(payload);
        break;
    }
  }
}

class TaskChannelStore extends ChannelStoreBase {
  get collectionName() { return 'tasks'; }

  constructor() {
    super();

    this.bindListeners({
      setSocket:     TaskActions.SET_SOCKET,
      handleAddTask: TaskActions.ADD_TASK,
      handleDelTask: TaskActions.DEL_TASK
    });
  }

  handleAddTask({label, section}) {
    console.log('addTask:', label, section);
    this.addItem({label: label, section_id: section.id, position: 0});
  }

  handleDelTask({task, section}) {
    console.log('delTask:', task, section);
    this.deleteItem({id: task.id});
  }
}

export default alt.createStore(TaskChannelStore, 'TaskChannelStore');

import alt from '../util/alt';
import Task from '../models/task';
import TaskActions from "../actions/task";

/* global Immutable */
/* global inflection */
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

  addItem(task) {
    assertChannelConnected('addItem');
    console.log('addItem:', task);
    this.executeOperation('add', task, payload => this.processEvent('del', payload));
    setTimeout(() => TaskActions.taskAdded(task), 0);
  }

  deleteItem(item) {
    assertChannelConnected('deleteItem');
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
      TaskActions.taskDeleted(payload);
      this.pending = this.pending.remove(payload.ref);
    }
    TaskActions.taskAdded(payload);
  }

  itemDeleted(payload) {
    console.log('itemDeleted:', payload);
    let attributes = payload[this.modelName],
        id = attributes && attributes.id;

    if (id) {
      TaskActions.taskDeleted(id);
      this.pending = this.pending.remove(id);
    }
  }

  executeOperation(type, item, onError = function () {}) {
    let operation = new Operation({type, id: item.id, item: item});
    this.pending = this.pending.set(item.id, operation);
    _channel.push(type, {ref: item.id, attributes: item.toObject()})
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
      setSocket:        TaskActions.SET_SOCKET,
      handleAddTask:    TaskActions.ADD_TASK,
      handleDeleteTask: TaskActions.DELETE_TASK
    });
  }

  handleAddTask(task) {
    console.log('addTask: task = ', task);
    this.addItem(task);
  }

  handleDeleteTask(task) {
    console.log('deleteTask: task = ', task);
    this.deleteItem(task);
  }
}

export default alt.createStore(TaskChannelStore, 'TaskChannelStore');

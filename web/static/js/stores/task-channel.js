import alt from '../util/alt';
import Task from '../models/task';
import TaskActions from "../actions/task";

/* global Immutable */
/* global inflection */
let Operation = Immutable.Record({type: null, item: null});

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

  get modelName() { return inflection.singularize(this.collectionName); }

  get collectionName()       { throw "ChannelStoreBase: collectionName getter not implemented"; }
  itemAdded(item)            { throw "ChannelStoreBase: itemAdded method not implemented"; }
  itemDeleted(item)          { throw "ChannelStoreBase: itemDeleted method not implemented"; }
  triggerError(errorMessage) { throw "ChannelStoreBase: triggerError method not implemented"; }

  setSocket(socket) {
    if (_channel) {
      _channel.disconnect();
    }

    _channel = socket.chan(`${this.collectionName}:store`, {token: "todo-task-token"});
    _channel
      .join()
      .receive("ok", () => this._listenForItemEvents())
      .receive("error", () => _channel = null)
      .receive("ignore", () => _channel = null);
  }

  addItem(item) {
    assertChannelConnected('addItem');
    this._executeOperation('add', item, payload => this._processEvent('delete', payload));
    this.itemAdded(item);
  }

  deleteItem(item) {
    assertChannelConnected('deleteItem');
    if (item) {
      this.itemDeleted(item);
      this._executeOperation('delete', item, payload => {
        this._processEvent('add', {ref: item.id, [this.modelName]: item.toJSON()});
      });
    }
    return item;
  }

  _listenForItemEvents() {
    assertChannelConnected('_listenForItemEvents');
    _channel.on('added', payload => this._itemAdded(payload));
    _channel.on('deleted', payload => this._itemDeleted(payload));
  }

  _itemAdded(payload) {
    if (payload.ref) {
      TaskActions.taskDeleted(payload);
      this.pending = this.pending.remove(payload.ref);
    }
    TaskActions.taskAdded(payload);
  }

  _itemDeleted(payload) {
    let attributes = payload[this.modelName],
        id = attributes && attributes.id;

    id = id || payload.ref;
    if (id) {
      TaskActions.taskDeleted(id);
      this.pending = this.pending.remove(id);
    }
  }

  _executeOperation(type, item, onError = function () {}) {
    let operation = new Operation({type, item: item});
    this.pending = this.pending.set(item.id, operation);
    _channel.push(type, {ref: item.id, attributes: item.toObject()})
      .receive('ok', payload => this._processEvent(type, payload))
      .receive('error', onError);
  }

  _processEvent(type, payload) {
    if (payload.errors) {
      this._triggerError(payload.errors);
    }
    switch (type) {
      case 'add':
        this._itemAdded(payload);
        break;
      case 'delete':
        this._itemDeleted(payload);
        break;
    }
  }

  _triggerError(errors) {
    function format(name, messages) {
      return messages.map(message => `${name} ${message}`).join(', ');
    }
    let message = Object.keys(errors).reduce(function(messages, name) {
      return messages.concat(format(name, errors[name]));
    }, []);
    this.triggerError(message.join(', '));
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
    this.addItem(task);
  }

  itemAdded(task) {
    setTimeout(() => TaskActions.taskAdded(task), 0);
  }

  handleDeleteTask(task) {
    this.deleteItem(task);
  }

  itemDeleted(task) {
    setTimeout(() => TaskActions.taskDeleted(task), 0);
  }

  triggerError(errorMessage) {
    TaskActions.errorChanged(errorMessage);
  }
}

export default alt.createStore(TaskChannelStore, 'TaskChannelStore');

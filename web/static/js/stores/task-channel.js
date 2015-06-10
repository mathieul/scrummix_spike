import alt from '../util/alt';
import ChannelStoreBase from '../util/channel-store-base';
import Task from '../models/task';
import TaskActions from "../actions/task";
import ChannelActions from '../actions/channel';
/* global Immutable */
/* global inflection */

class TaskChannelStore extends ChannelStoreBase {
  get collectionName()        { return 'tasks'; }
  get model()                 { return Task; }
  triggerItemAdded(task)      { console.log('triggerItemAdded:', task); TaskActions.taskAdded(task); }
  triggerItemUpdated(task)    { console.log('triggerItemUpdated:', task); TaskActions.taskUpdated(task); }
  triggerItemDeleted(task)    { console.log('triggerItemDeleted:', task); TaskActions.taskDeleted(task); }
  triggerError(errorMessage)  { TaskActions.errorChanged(errorMessage); }

  constructor() {
    super();

    this.bindListeners({
      connect:              ChannelActions.CONNECT,
      handleAdd:            TaskActions.ADD_TASK,
      handleDelete:         TaskActions.DELETE_TASK,
      handleComplete:       TaskActions.COMPLETE,
      handleCancelComplete: TaskActions.CANCEL_COMPLETE
    });
  }

  handleAdd(task) {
    this.addItem(task);
  }

  handleDelete(task) {
    this.deleteItem(task);
  }

  handleComplete(task) {
    let now = (new Date()).toISOString();
    this.updateItem(task, {completed_at: now});
  }

  handleCancelComplete(task) {
    this.updateItem(task, {completed_at: null});
  }
}

export default alt.createStore(TaskChannelStore, 'TaskChannelStore');

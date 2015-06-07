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
  handleAddTask(task)         { this.addItem(task); }
  handleDeleteTask(task)      { this.deleteItem(task); }
  triggerItemAdded(task)      { console.log('triggerItemAdded:', task); TaskActions.taskAdded(task); }
  triggerItemDeleted(task)    { console.log('triggerItemDeleted:', task); TaskActions.taskDeleted(task); }
  triggerError(errorMessage)  { TaskActions.errorChanged(errorMessage); }

  constructor() {
    super();

    this.bindListeners({
      connect:          ChannelActions.CONNECT,
      handleAddTask:    TaskActions.ADD_TASK,
      handleDeleteTask: TaskActions.DELETE_TASK
    });
  }
}

export default alt.createStore(TaskChannelStore, 'TaskChannelStore');

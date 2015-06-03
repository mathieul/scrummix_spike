import alt from '../util/alt';
import TaskSource from '../sources/task';
import Task from '../models/task';
import TaskActions from "../actions/task";

class TaskStore {
  constructor() {
    this.tasks = Immutable.Map();
    this.bindListeners({
      handleSetTasks:          TaskActions.SET_TASKS,
      handleFetchTasksFailed:  TaskActions.FETCH_TASKS_FAILED,
      handleTaskAdded:         TaskActions.TASK_ADDED,
      handleTaskDeleted:       TaskActions.TASK_DELETED
    });
    this.exportAsync(TaskSource);
  }

  static setFilter(filter) {
    this._filter = filter;
  }

  handleSetTasks(tasks) {
    let filter = this.getInstance()._filter;
    this.errorMessage = null;
    this.tasks = filter ? tasks.filter(filter) : tasks;
  }

  handleFetchTasksFailed(message) {
    this.errorMessage = message;
  }

  handleTaskAdded(attributes) {
    let task = new Task(attributes);
    let filter = this.getInstance()._filter;
    if (!filter || filter(task)) {
      this.tasks = this.tasks.set(task.id, task);
      this.emitChange();
    }
  }

  handleTaskDeleted(id) {
    let task = this.tasks.get(id);
    if (task) {
      this.tasks = this.tasks.delete(task.id);
      this.emitChange();
    }
  }
}

export default alt.createStore(TaskStore, 'TaskStore');

import alt from '../util/alt';
import TaskSource from '../sources/task';
import Task from '../models/task';
import TaskActions from "../actions/task";

class TaskStore {
  constructor() {
    this.tasks = Immutable.Map();
    this.bindListeners({
      handleSetTasks:          TaskActions.SET_TASKS,
      handleFetchTasksFailed:  TaskActions.FETCH_TASKS_FAILED
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
}

export default alt.createStore(TaskStore, 'TaskStore');

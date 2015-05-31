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

  handleSetTasks(task) {
    this.errorMessage = null;
    this.task = task;
  }

  handleFetchTasksFailed(message) {
    this.errorMessage = message;
  }
}

export default alt.createStore(TaskStore, 'TaskStore');

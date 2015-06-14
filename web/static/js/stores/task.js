import alt from '../util/alt';
import TaskActions from "../actions/task";

class TaskStore {
  constructor() {
    this.tasks = Immutable.Map();
    this.bindListeners({
      handleSetTasks:          TaskActions.SET_TASKS,
      handleFetchTasksFailed:  TaskActions.FETCH_TASKS_FAILED,
      handleTaskAdded:         TaskActions.TASK_ADDED,
      handleTaskDeleted:       TaskActions.TASK_DELETED,
      handleTaskUpdated:       TaskActions.TASK_UPDATED
    });
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

  handleTaskAdded(task) {
    let filter = this.getInstance()._filter;
    if (!filter || filter(task)) {
      this.tasks = this.tasks.set(task.id, task);
      this.emitChange();
    }
  }

  handleTaskUpdated(task) {
    let filter = this.getInstance()._filter;
    if (!filter || filter(task)) {
      this.tasks = this.tasks.delete(task.id);
      this.tasks = this.tasks.set(task.id, task);
      this.emitChange();
    }
  }

  handleTaskDeleted(task) {
    if (task) {
      this.tasks = this.tasks.delete(task.id);
      this.emitChange();
    }
  }
}

export default alt.createStore(TaskStore, 'TaskStore');

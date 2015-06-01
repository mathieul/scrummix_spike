import alt from '../util/alt';

class TaskActions {
  setTasks(tasks) {
    this.dispatch(tasks);
  }

  fetchTasksFailed(message) {
    this.dispatch(message);
  }

  addTask(label, section) {
    this.dispatch(label, section);
  }

  delTask(task, section) {
    this.dispatch(task, section);
  }
}

export default alt.createActions(TaskActions);

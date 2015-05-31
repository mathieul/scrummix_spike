import alt from '../util/alt';

class TaskActions {
  setTasks(tasks) {
    this.dispatch(tasks);
  }

  fetchTasksFailed(message) {
    this.dispatch(message);
  }
}

export default alt.createActions(TaskActions);

import alt from '../util/alt';

class TaskActions {
  setSocket(socket) {
    this.dispatch(socket);
  }

  setTasks(tasks) {
    this.dispatch(tasks);
  }

  fetchTasksFailed(message) {
    this.dispatch(message);
  }

  addTask(attributes) {
    this.dispatch(attributes);
  }

  taskAdded(task) {
    this.dispatch(task);
  }

  deleteTask(task) {
    this.dispatch(task);
  }

  taskDeleted(id) {
    this.dispatch(id);
  }

  errorChanged(errorMessage) {
    this.dispatch(errorMessage);
  }

  complete(task) {
    this.dispatch(task);
  }

  cancelComplete(task) {
    this.dispatch(task);
  }

  taskUpdated(task) {
    this.dispatch(task);
  }
}

export default alt.createActions(TaskActions);

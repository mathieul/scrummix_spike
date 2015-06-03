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

  addTask(label, section) {
    this.dispatch({label, section});
  }

  taskAdded(task) {
    this.dispatch(task);
  }

  delTask(task, section) {
    this.dispatch({task, section});
  }

  taskDeleted(id) {
    this.dispatch(id);
  }

}

export default alt.createActions(TaskActions);

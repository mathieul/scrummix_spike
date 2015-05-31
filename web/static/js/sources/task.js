import Task from '../models/task';
import TaskActions from "../actions/task";

export default {
  fetchTasks: {
    remote() {
      return new Promise(function (resolve, reject) {
        if (false) {
          reject("Testing error message");
        } else {
          let taskMap = Scrummix.tasks.tasks.reduce(function (map, attributes) {
            return map.set(attributes.id, new Task(attributes));
          }, Immutable.Map());
          console.log('TASKS LOADED:', taskMap);
          resolve(taskMap);
        }
      });
    },

    success: TaskActions.setTasks,
    error:   TaskActions.fetchTasksFailed
  }
};

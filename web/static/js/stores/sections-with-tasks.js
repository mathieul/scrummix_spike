import alt from '../util/alt';
import SectionActions from '../actions/section';
import SectionStore from './section';
import TaskStore from './task';
/* global Immutable */

class SectionsWithTasks {
  constructor() {
    this.sections = Immutable.List();
    this.bindListeners({
      handleFetch: SectionActions.FETCH_SECTIONS_WITH_TASKS
    });
  }

  handleFetch() {
    this.waitFor([SectionStore, TaskStore]);
    console.log('WAITFOR DONE');

    let {sections} = SectionStore.getState();
    let {tasks}    = TaskStore.getState();
  }
}

export default alt.createStore(SectionsWithTasks, 'SectionsWithTasks');

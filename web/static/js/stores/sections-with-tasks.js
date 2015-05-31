import alt from '../util/alt';
import SectionActions from '../actions/section';
import SectionStore from './section';
import TaskActions from '../actions/task';
import TaskStore from './task';
/* global Immutable */

let _sections = null, _tasks = null, _filters = {};

class SectionsWithTasks {
  constructor() {
    this.sections = Immutable.List();
    this.exportPublicMethods({
      fetch: (...args) => this.fetch(...args)
    });
    SectionStore.listen(state => this.buildSectionList(state));
    TaskStore.listen(state => this.buildSectionList(state));
  }

  fetch(filters = {}) {
    _filters = filters;
    SectionStore.fetchSections();
    TaskStore.fetchTasks();
  }

  buildSectionList(data) {
    if (data.sections) { _sections = data.sections; }
    if (data.tasks)    { _tasks = data.tasks; }

    if (_sections && _tasks) {
      let collection = _sections;

      if (_filters.section) {
        collection = collection.filter(_filters.section);
      }

      collection = collection
        .sortBy(section => section.position)
        .toList()
        .map(function (section) {
          let sectionTasks = _tasks.filter(task => task.section_id === section.id).toList();
          return section.set('tasks', sectionTasks);
        });

      this.sections = collection;
      this.emitChange();
    }
  }
}

export default alt.createStore(SectionsWithTasks, 'SectionsWithTasks');

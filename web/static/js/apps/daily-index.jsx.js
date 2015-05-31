import SectionListViewer from '../components/section-list-viewer.jsx';
import SectionsWithTasksStore from '../stores/sections-with-tasks';
import SectionStore from '../stores/section';
import TaskStore from '../stores/task';
import SectionActions from '../actions/section';
/* global Alt */
/* global React */

let AltContainer = Alt.addons.AltContainer;

let Application = React.createClass({
  render() {
    return (
      <AltContainer store={SectionsWithTasksStore}>
        <SectionListViewer />
      </AltContainer>
    );
  },

  componentDidMount() {
    SectionStore.fetchSections();
    TaskStore.fetchTasks();
    SectionActions.fetchSectionsWithTasks();
    let ss = SectionStore;
    debugger;
  }
});

React.render(
  <Application />,
  document.getElementById('daily-index')
);

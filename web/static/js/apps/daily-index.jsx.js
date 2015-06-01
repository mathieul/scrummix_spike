import SectionListViewer from '../components/section-list-viewer.jsx';
import SectionsWithTasksStore from '../stores/sections-with-tasks';
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
    SectionsWithTasksStore.fetch();
  }
});

React.render(
  <Application />,
  document.getElementById('daily-index')
);

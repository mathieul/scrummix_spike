import SectionEditor from '../components/section-editor';
import ActionsTasks from '../actions/tasks';
import TasksStore from '../stores/tasks';
/* global React */
/* global Reflux */

let Application = React.createClass({
  mixins: [Reflux.listenTo(TasksStore, 'onTaskStoreChange')],

  getInitialState() {
    return {section: this.props.section};
  },

  onTaskStoreChange(info) {
    console.log('onTaskStoreChange:', info);
    this.setState({section: this.props.section});
  },

  render() {
    return <SectionEditor section={ this.state.section } />;
  }
});

let section = Scrummix.section.section;

React.render(
  <Application section={section} />,
  document.getElementById('daily-edit')
);

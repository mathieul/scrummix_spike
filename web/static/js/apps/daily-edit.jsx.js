import {Socket} from "phoenix";
import SectionsWithTasksStore from '../stores/sections-with-tasks';
import TaskChannelStore from '../stores/task-channel';
import ChannelActions from '../actions/channel';
import TaskActions from '../actions/task';
import SectionEditor from '../components/section-editor.jsx';
/* global Alt */
/* global React */

let AltContainer = Alt.addons.AltContainer;

let socket = new Socket("/ws", {params: {user_id: "user-todo"}});
socket.connect();
socket.onError(reason => console.log("TODO>>> SOCKET ERROR ---> ", reason));
socket.onClose(reason => console.log("TODO>>> SOCKET CLOSE ---> ", reason));

ChannelActions.connect({socket: socket, token: 'todo-task-token', id: Scrummix.section_id});

let Application = React.createClass({
  render() {
    return (
      <AltContainer store={SectionsWithTasksStore}>
        <SectionEditor />
      </AltContainer>
    );
  },

  componentDidMount() {
    let sectionId = Scrummix.section_id;
    SectionsWithTasksStore.fetch({section: section => section.id === sectionId});
  }
});

React.render(
  <Application />,
  document.getElementById('daily-edit')
);

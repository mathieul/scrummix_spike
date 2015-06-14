import {Socket} from "phoenix";
import SectionChannelStore from '../stores/section-channel';
import TaskChannelStore from '../stores/task-channel';
import SectionsWithTasksStore from '../stores/sections-with-tasks';
import ChannelActions from '../actions/channel';
import SectionEditor from '../components/section-editor.jsx';
/* global Alt */
/* global React */

let AltContainer = Alt.addons.AltContainer;

let socket = new Socket("/ws", {params: {user_id: "user-todo"}});
socket.connect();
socket.onError(reason => console.log("TODO>>> SOCKET ERROR ---> ", reason));
socket.onClose(reason => console.log("TODO>>> SOCKET CLOSE ---> ", reason));

ChannelActions.join({
  socket: socket,
  token: 'todo-scrummix-token',
  subtopic: `section_id=${Scrummix.section_id}`
});

let Application = React.createClass({
  render() {
    return (
      <AltContainer store={SectionsWithTasksStore}>
        <SectionEditor />
      </AltContainer>
    );
  },

  componentDidMount() {
    SectionsWithTasksStore.fetch();
  }
});

React.render(
  <Application />,
  document.getElementById('daily-edit')
);

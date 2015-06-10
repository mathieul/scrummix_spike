import {Socket} from "phoenix";
import TaskChannelStore from '../stores/task-channel';
import SectionsWithTasksStore from '../stores/sections-with-tasks';
import ChannelActions from '../actions/channel';
import SectionListViewer from '../components/section-list-viewer.jsx';
/* global Alt */
/* global React */

let AltContainer = Alt.addons.AltContainer;

let socket = new Socket("/ws", {params: {user_id: "user-todo"}});
socket.connect();
socket.onError(reason => console.log("TODO>>> SOCKET ERROR ---> ", reason));
socket.onClose(reason => console.log("TODO>>> SOCKET CLOSE ---> ", reason));

ChannelActions.join({
  socket: socket,
  token: 'todo-task-token',
  subtopic: 'all'
});

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

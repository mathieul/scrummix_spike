import {Socket} from "phoenix";
import SectionListViewer from '../components/section-list-viewer.jsx';
import TaskChannelStore from '../stores/task-channel';
import SectionsWithTasksStore from '../stores/sections-with-tasks';
import ChannelActions from '../actions/channel';
import SectionActions from '../actions/section';
/* global Alt */
/* global React */

let AltContainer = Alt.addons.AltContainer;

let socket = new Socket("/ws", {params: {user_id: "user-todo"}});
socket.connect();
socket.onError(reason => console.log("TODO>>> SOCKET ERROR ---> ", reason));
socket.onClose(reason => console.log("TODO>>> SOCKET CLOSE ---> ", reason));

ChannelActions.connect({socket: socket, token: 'todo-task-token'});

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

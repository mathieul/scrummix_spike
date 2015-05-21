import {Socket} from "phoenix";
import SectionEditor from '../components/section-editor';
import sectionStore from '../stores/section';
/* global React */
/* global Reflux */

let socket = new Socket("/ws", {params: {user_id: "user-todo"}});
socket.connect();
socket.onError(reason => console.log("TODO>>> SOCKET ERROR ---> ", reason));
socket.onClose(reason => console.log("TODO>>> SOCKET CLOSE ---> ", reason));
sectionStore.socket = socket;

let Application = React.createClass({
  mixins: [Reflux.connect(sectionStore, 'section')],

  render() {
    return <SectionEditor section={ this.state.section } />;
  }
});

React.render(
  <Application />,
  document.getElementById('daily-edit')
);

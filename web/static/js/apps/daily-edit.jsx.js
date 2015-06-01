import {Socket} from "phoenix";
import SectionsWithTasksStore from '../stores/sections-with-tasks';
import SectionEditor from '../components/section-editor.jsx';
/* global Alt */
/* global React */

let AltContainer = Alt.addons.AltContainer;

let socket = new Socket("/ws", {params: {user_id: "user-todo"}});
socket.connect();
socket.onError(reason => console.log("TODO>>> SOCKET ERROR ---> ", reason));
socket.onClose(reason => console.log("TODO>>> SOCKET CLOSE ---> ", reason));
/* TODO: set socket store */

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

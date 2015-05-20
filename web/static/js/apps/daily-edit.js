import {Socket} from "phoenix";
import SectionEditor from '../components/section-editor';
import sectionStore from '../stores/section';
/* global React */
/* global Reflux */

let socket = new Socket("/ws");
socket.connect();
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

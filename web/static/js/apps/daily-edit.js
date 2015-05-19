import {Socket} from "phoenix";
import SectionEditor from '../components/section-editor';
import SectionStore from '../stores/section';
/* global React */
/* global Reflux */

let socket = new Socket("/ws");
socket.connect();
let channel = socket.join("sections:lobby", {})
channel.receive("ok", chan => console.log("welcome to chat:", chan));
channel.push("hello there", {body: "something here"});

let Application = React.createClass({
  mixins: [Reflux.connect(SectionStore, 'section')],

  render() {
    return <SectionEditor section={ this.state.section } />;
  }
});

React.render(
  <Application />,
  document.getElementById('daily-edit')
);

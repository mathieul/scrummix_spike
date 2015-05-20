import {Socket} from "phoenix";
import SectionEditor from '../components/section-editor';
import SectionStore from '../stores/section';
/* global React */
/* global Reflux */

let socket = new Socket("/ws");
socket.connect();
let chan = socket.join("sections:lobby", {});
setTimeout(function () {
  chan.on("back_msg", function (payload) { console.log("back_msg:", payload); });
  chan.on("front_msg", function (payload) { console.log("front_msg -->", payload) });
  chan.push("front_msg", {body: "something here"});
}, 0);

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

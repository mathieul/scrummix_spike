import SectionEditor from '../components/section-editor';
import SectionStore from '../stores/section';
/* global React */
/* global Reflux */

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

import SectionEditor from '../components/section-editor';
/* global React */

class Application extends React.Component {
  render() {
    return <SectionEditor section={ this.props.section } />;
  }
}

let section = Scrummix.section.section;

React.render(
  <Application section={section} />,
  document.getElementById('daily-edit')
);

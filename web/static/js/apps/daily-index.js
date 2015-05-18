import SectionListViewer from '../components/section-list-viewer';
/* global React */

class Application extends React.Component {
  render() {
    return <SectionListViewer sections={ this.props.sections } />;
  }
}

let sections = Scrummix.sections.sections;

React.render(
  <Application sections={sections} />,
  document.getElementById('daily-index')
);

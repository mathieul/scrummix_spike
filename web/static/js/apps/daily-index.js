import SectionListViewer from '../components/section-list-viewer';
/* global React */

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {color: 'teal', label: 'Yesterday'},
        {color: 'purple', label: 'Today'},
        {color: 'orange', label: 'Impediments'}
      ]
    };
  }

  render() {
    return <SectionListViewer sections={ this.state.sections } />;
  }
}

React.render(
  <Application />,
  document.getElementById('example')
);

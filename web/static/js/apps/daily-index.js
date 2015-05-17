import SectionListViewer from '../components/section-list-viewer';
/* global React */

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {color: 'teal', label: 'Yesterday', tasks: [
          {label: "first task", completed_at: new Date("2015-03-09 09:03")},
          {label: "second task", completed_at: null}
        ]},
        {color: 'purple', label: 'Today', tasks: []},
        {color: 'orange', label: 'Impediments', tasks: []}
      ]
    };
  }

  render() {
    return <SectionListViewer sections={ this.state.sections } />;
  }
}

React.render(
  <Application />,
  document.getElementById('daily-index')
);

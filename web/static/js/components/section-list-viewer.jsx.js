import SectionItemViewer from './section-item-viewer.jsx';
/* global React */

export default React.createClass({
  getInitialState() {
    return {sections: this.props.sections};
  },

  componentWillReceiveProps(props) {
    this.setState({sections: props.sections});
  },

  render() {
    const {sections} = this.state;
    const itemNodes = sections.map(function (section) {
      return <SectionItemViewer key={ `section-${section.id}` } section={ section } />;
    });

    return <div className="section-list-viewer">{ itemNodes }</div>;
  }
});

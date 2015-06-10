import SectionItemViewer from './section-item-viewer.jsx';
/* global React */

export default React.createClass({
  render() {
    const {sections} = this.props;
    const itemNodes = sections.map(function (section) {
      return <SectionItemViewer key={ `section-${section.id}` } section={ section } />;
    });

    return <div className="section-list-viewer">{ itemNodes }</div>;
  }
});

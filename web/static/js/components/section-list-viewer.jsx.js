import SectionItemViewer from './section-item-viewer.jsx';
/* global React */

export default React.createClass({
  render() {
    let sections = this.props.sections.toArray();
    let itemNodes = sections.map(function (section) {
      return <SectionItemViewer key={`section-${section.id}`} section={section} />;
    });

    return <div className="section-list-viewer">{ itemNodes }</div>;
  }
});

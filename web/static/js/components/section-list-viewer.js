import SectionItemViewer from './section-item-viewer';
/* global React */

export default class SectionListViewer extends React.Component {
  render() {
    let itemNodes = this.props.sections.map(function (section) {
      return <SectionItemViewer section={section} />;
    });

    return <div className="section-list-viewer">{ itemNodes }</div>;
  }
}
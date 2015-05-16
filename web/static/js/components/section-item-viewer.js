/* global React */

export default class SectionItemViewer extends React.Component {
  render() {
    let section = this.props.section;
    let dataEditUrl = '/todo';

    return (
      <div className="section-item-viewer">
        <div className={ `ui ${section.color} ribbon label` }>{ section.label }</div>
        <div className="ui right internal attached rail">
          <a href="{ dataEditUrl }" className="ui icon button right floated">
            <i className="write icon"></i>
          </a>
        </div>
        <div className="ui divided list"></div>
      </div>
    );
  }
};

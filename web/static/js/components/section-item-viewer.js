/* global React */

export default class SectionItemViewer extends React.Component {
  render() {
    let section = this.props.section;
    let dataEditUrl = '/todo';

    return (
      <div className="ui raised segment">
        <div className={ `ui ${section.color} ribbon label` }>{ section.label }</div>
        <div className="ui right internal attached rail">
          <a href={ dataEditUrl } className="ui icon button right floated">
            <i className="write icon"></i>
          </a>
        </div>
        <div className="ui divided list">
          { this.renderTasks(section.tasks) }
        </div>
      </div>
    );
  }

  renderTasks(tasks) {
    if (tasks.length === 0) {
      return (
        <div className="item">
          <i className="arrow right icon"></i>
          <div className="content ui label">
            none
          </div>
        </div>
      );
    } else {
      return tasks.map(function (task) {
        let classCompleted = task.completed_at ? 'task-completed' : '';
        return (
          <div className="item">
            <i className="arrow right icon"></i>
            <div className="content">
              <p className={ classCompleted }>{ task.label }</p>
            </div>
          </div>
        );
      });
    }
  }
};

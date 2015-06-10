/* global React */

export default React.createClass({
  getInitialState() {
    return {section: this.props.section};
  },

  componentWillReceiveProps(props) {
    this.setState({section: this.props.section});
  },

  render() {
    const {section} = this.state;

    if (!section) {
      return <div className="ui raised segment" />;
    }

    return (
      <div className="ui raised segment">
        <div className={ `ui ${section.color} ribbon label` }>{ section.label }</div>
        <div className="ui right internal attached rail">
          <a href={ `/daily/edit/${section.id}` } className="ui icon button right floated">
            <i className="write icon"></i>
          </a>
        </div>
        <div className="ui divided list">
          { this.renderTasks(section.tasks) }
        </div>
      </div>
    );
  },

  renderTasks(tasks) {
    if (tasks.size === 0) {
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
          <div className="item" key={ `task-${task.id || task.ref}` }>
            <i className="arrow right icon"></i>
            <div className="content">
              <p className={ classCompleted }>{ task.label }</p>
            </div>
          </div>
        );
      });
    }
  }
});

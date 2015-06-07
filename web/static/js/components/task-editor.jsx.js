import TaskActions from '../actions/task';
/* global React */

export default React.createClass({
  render() {
    let task = this.props.task;
    let completedClassName = task.completed_at ? 'task-completed' : null;

    return (
      <div className="item task-editor">
        <div className="content">
          <div className="ui form">
            <div className="ui grid">
              <div className="thirteen wide column">
                <div className="inline field">
                  <div className="ui toggle checkbox" ref="toggle">
                    <input type="checkbox" checked={ !!task.completed_at } />
                  </div>
                  <span className={ completedClassName }>{ task.label } [{ task.id }]</span>
                </div>
              </div>
              <div className="right aligned three wide column">
                <button className="circular red ui tiny icon button" onClick={ this.handleClick }>
                  <i className="icon remove"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  componentDidMount() {
    let checkboxNode = React.findDOMNode(this.refs.toggle);
    if (checkboxNode) {
      jQuery(checkboxNode).checkbox();
    }
  },

  handleClick(event) {
    event.preventDefault();
    TaskActions.deleteTask(this.props.task);
  }
});

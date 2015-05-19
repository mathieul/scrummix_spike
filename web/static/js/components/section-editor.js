import TaskEditor from "./task-editor";
import ActionTasks from "../actions/tasks";
/* global React */

export default React.createClass({
  getInitialState() {
    return {newTaskLabel: null};
  },

  render() {
    let section = this.props.section;
    if (!section) {
      return <div className="empty-section-editor"></div>;
    }

    let itemNodes = section.tasks.map(function (task) {
      return <TaskEditor key={ `task-${task.id}` } task={ task } />;
    });

    return (
      <div className="section-editor">
        <form className="ui form" onSubmit={ this.handleSubmit } role="form">
          <h4 className="ui dividing header">{ section.label }</h4>
          <div className="one field">
            <div className="field">
              <div className="ui grid">
                <div className="fourteen wide column">
                  <input type="text"
                         placeholder="Enter new task"
                         value={ this.state.newTaskLabel }
                         onChange={ this.handleChange }
                         autofocus />
                </div>
                <div className="two wide column">
                  <button type="submit" className="circular blue ui tiny icon button">
                    <i className="icon add"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="field">
              <div className="ui divided list">
              { itemNodes }
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  },

  handleChange(event) {
    this.setState({newTaskLabel: event.target.value});
  },

  handleSubmit(event) {
    event.preventDefault();
    ActionTasks.addTask(this.state.newTaskLabel);
    this.setState({newTaskLabel: null});
  }
});

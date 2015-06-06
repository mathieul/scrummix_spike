import TaskEditor from "./task-editor.jsx";
import TaskActions from "../actions/task";
import Task from "../models/task";
/* global React */

export default React.createClass({
  getInitialState() {
    return {newTaskLabel: null};
  },

  render() {
    let section = this.props.sections.first();
    if (!section) {
      return <div className="empty-section-editor"></div>;
    }

    let itemNodes = section.tasks.map(function (task) {
      return <TaskEditor key={ `task-${task.id || task.ref}` } task={ task } section={ section } />;
    });

    let labelClasses = `ui ribbon ${section.color} label`;

    return (
      <div className="section-editor">
        <form className="ui form raised segment" onSubmit={ this.handleSubmit } role="form">
          <div className={labelClasses}>{ section.label }</div>
          <div className="one field">
            <div className="field">
              <div className="ui grid">
                <div className="sixteen wide column"></div>
                <div className="thirteen wide column">
                  <input type="text"
                         placeholder="Enter new task"
                         value={ this.state.newTaskLabel }
                         onChange={ this.handleChange }
                         required
                         autofocus />
                </div>
                <div className="right aligned three wide column">
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
    let task = new Task({
      label: this.state.newTaskLabel,
      section_id: this.props.sections.first().id
    });
    TaskActions.addTask(task);
    this.setState({newTaskLabel: null});
  }
});

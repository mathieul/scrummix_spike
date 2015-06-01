import TaskEditor from "./task-editor.jsx";
import TaskActions from "../actions/task";
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
                         required
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
    TaskActions.addTask(this.state.newTaskLabel, this.props.sections.first());
    this.setState({newTaskLabel: null});
  }
});

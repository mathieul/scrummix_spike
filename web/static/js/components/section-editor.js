import TaskEditor from "./task-editor";
import ActionsTasks from "../actions/tasks";
/* global React */

export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {newTaskLabel: null};
  },

  render() {
    let section = this.props.section;
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
                         valueLink={ this.linkState('newTaskLabel') }
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

  handleSubmit(event) {
    event.preventDefault();
    ActionsTasks.addTask(this.state.newTaskLabel, this.props.section);
  }
});

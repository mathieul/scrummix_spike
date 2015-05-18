import TaskEditor from "./task-editor";
/* global React */

export default class SectionEditor extends React.Component {
  render() {
    let section = this.props.section;
    let itemNodes = section.tasks.map(function (task) {
      return <TaskEditor key={ `task-${task.id}` } task={ task } />;
    });

    return (
      <div className="section-editor">
        <form className="ui form" e-submit="add_task" role="form">
          <h4 className="ui dividing header">{ section.label }</h4>
          <div className="one field">
            <div className="field">
              <div className="ui grid">
                <div className="fourteen wide column">
                  <input type="text"
                         placeholder="Enter new task"
                         value=""
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
  }
}

/* global React */

export default class TaskEditor extends React.Component {
  render() {
    let task = this.props.task;

    return (
      <div className="item task-editor">
        <div className="content">
          <div className="ui form">
            <div className="ui grid">
              <div className="fourteen wide column">
                <div className="inline field">
                  <div className="ui toggle checkbox">
                    <input type="checkbox" checked="{ '' }" />
                  </div>
                  <span className="task-completed">{ task.label }</span>
                </div>
              </div>
              <div className="two wide column">
                <button className="circular red ui tiny icon button" e-click="remove_task">
                  <i className="icon remove"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

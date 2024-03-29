defmodule Scrummix.TaskView do
  use Scrummix.Web, :view

  def render("index.json", %{tasks: tasks}) do
    %{tasks: render_many(tasks, "task.json")}
  end

  def render("show.json", %{task: task}) do
    %{task: render_one(task, "task.json")}
  end

  def render("task.json", %{task: task}) do
    %{id: task.id, label: task.label, position: task.position, completed_at: task.completed_at}
  end
end

defmodule Scrummix.SectionView do
  use Scrummix.Web, :view

  def render("index.json", %{sections: sections}) do
    %{sections: render_many(sections, "section.json")}
  end

  def render("show.json", %{section: section}) do
    %{section: render_one(section, "section.json")}
  end

  def render("section.json", %{section: section}) do
    %{
      id: section.id,
      label: section.label,
      color: section.color,
      position: section.position,
      tasks: Enum.map(section.tasks, &render_task/1)
    }
  end

  defp render_task(task),
    do: Scrummix.TaskView.render("task.json", %{task: task})
end

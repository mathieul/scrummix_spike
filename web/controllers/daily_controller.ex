defmodule Scrummix.DailyController do
  use Scrummix.Web, :controller

  alias Scrummix.Section
  alias Scrummix.Task
  alias Scrummix.SectionView
  alias Scrummix.TaskView

  plug :action

  def index(conn, _params) do
    sections = Section.all_with_tasks |> Repo.all
    tasks    = Repo.all(Task)

    conn
    |> assign(:data, %{
      sections_json:  sections_json(sections),
      tasks_json:     tasks_json(tasks)
    })
    |> render("index.html")
  end

  defp sections_json(sections),
    do: render_to_string(SectionView, "index.json", %{sections: sections})

  defp tasks_json(tasks),
    do: render_to_string(TaskView, "index.json", %{tasks: tasks})

  def edit(conn, params) do
    section = Section.find_with_tasks(params["section_id"]) |> Repo.one

    conn
    |> assign(:data, %{
      section_id:     params["section_id"],
      sections_json:  sections_json([section]),
      tasks_json:     tasks_json(section.tasks)
    })
    |> render("edit.html")
  end
end

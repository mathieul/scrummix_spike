defmodule Scrummix.DailyController do
  use Scrummix.Web, :controller

  alias Scrummix.Section
  alias Scrummix.SectionView

  plug :action

  def index(conn, _params) do
    sections = Section.all_with_tasks |> Repo.all

    conn
    |> assign(:data, %{sections_json: sections_json(sections)})
    |> render("index.html")
  end

  defp sections_json(sections),
    do: render_to_string(SectionView, "index.json", %{sections: sections})

  def edit(conn, params) do
    section = Section.find_with_tasks(params["section_id"]) |> Repo.one

    conn
    |> assign(:data, %{section_json: section_json(section)})
    |> render("edit.html")
  end

  defp section_json(section),
    do: render_to_string(SectionView, "show.json", %{section: section})
end

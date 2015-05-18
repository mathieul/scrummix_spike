defmodule Scrummix.DailyController do
  use Scrummix.Web, :controller

  alias Scrummix.Section
  alias Scrummix.SectionView

  plug :action

  def index(conn, _params) do
    sections = Section.all_with_tasks |> Repo.all
    data = %{sections_json: render_to_string(SectionView, "index.json", %{sections: sections})}
    conn
    |> assign(:data, data)
    |> render("index.html")
  end
end

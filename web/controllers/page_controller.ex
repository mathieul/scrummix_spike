defmodule Scrummix.PageController do
  use Scrummix.Web, :controller

  alias Scrummix.Section
  alias Scrummix.SectionView

  plug :action

  def index(conn, _params) do
    data = %{sections_json: render_to_string(SectionView, "index.json", %{sections: Repo.all(Section)})}
    conn
    |> assign(:data, data)
    |> render("index.html")
  end
end

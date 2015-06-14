defmodule Scrummix.DailyController do
  use Scrummix.Web, :controller

  alias Scrummix.SectionView
  alias Scrummix.TaskView

  plug :action

  def index(conn, _params) do
    conn |> render("index.html")
  end

  def edit(conn, params) do
    conn
    |> assign(:data, %{section_id: params["section_id"]})
    |> render("edit.html")
  end
end

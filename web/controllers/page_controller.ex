defmodule Scrummix.PageController do
  use Scrummix.Web, :controller

  plug :action

  def index(conn, _params) do
    conn
    |> render("index.html")
  end
end

defmodule Scrummix.PageController do
  use Scrummix.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html", title: "Home"
  end
end

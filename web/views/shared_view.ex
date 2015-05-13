defmodule Scrummix.SharedView do
  use Scrummix.Web, :view

  def has_flash?(conn, kind) do
    get_flash(conn) |> Map.has_key?(kind)
  end
end

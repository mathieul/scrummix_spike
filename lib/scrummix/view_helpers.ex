defmodule Scrummix.ViewHelpers do
  import Phoenix.Controller, only: [view_module: 1, controller_template: 1]
  import Phoenix.View, only: [render_existing: 3]

  def render_dynamic_content(conn, kind) do
    view = view_module(conn)
    template = kind <> "." <> controller_template(conn)
    render_existing(view, template, [])
  end
end

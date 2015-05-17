defmodule Scrummix.SectionView do
  use Scrummix.Web, :view

  def render("index.json", %{sections: sections}) do
    %{sections: render_many(sections, "section.json")}
  end

  def render("show.json", %{section: section}) do
    %{data: render_one(section, "section.json")}
  end

  def render("section.json", %{section: section}) do
    %{id: section.id, label: section.label, color: section.color, position: section.position}
  end
end
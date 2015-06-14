defmodule Scrummix.SectionView do
  use Scrummix.Web, :view

  def render("items.json", %{sections: sections}) do
    %{items: render_many(sections, "section.json")}
  end

  def render("section.json", %{section: section}) do
    %{
      id: section.id,
      label: section.label,
      color: section.color,
      position: section.position
    }
  end
end

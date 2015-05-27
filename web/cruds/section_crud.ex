defmodule Scrummix.SectionCrud do
  alias Scrummix.Repo
  alias Scrummix.Section

  def create(params) do
    changeset = Section.changeset(%Section{}, params)
    if changeset.valid? do
      insert_record(changeset)
    else
      {:error, Scrummix.ChangesetView.render("error.json", changeset: changeset.errors)}
    end
  end

  defp insert_record(changeset) do
    try do
      section = Repo.insert(changeset)
      {:ok, Scrummix.SectionView.render("show.json", %{section: section})}
    rescue
      e in Postgrex.Error ->
        {:error, "TODO: process DB error '#{e.postgres.code}' (constraint #{e.postgres.constraint})"}
    end
  end
end

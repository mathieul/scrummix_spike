defmodule Scrummix.SectionController do
  use Scrummix.Web, :controller

  alias Scrummix.Section

  plug :scrub_params, "section" when action in [:create, :update]
  plug :action

  def index(conn, _params) do
    sections = Section.all_with_tasks |> Repo.all
    render(conn, "index.json", sections: sections)
  end

  def create(conn, %{"section" => section_params}) do
    changeset = Section.changeset(%Section{}, section_params)

    if changeset.valid? do
      section = Repo.insert(changeset)
      render(conn, "show.json", section: section)
    else
      conn
      |> put_status(:unprocessable_entity)
      |> render(Scrummix.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    section = Section.find_with_tasks(id) |> Repo.one
    render conn, "show.json", section: section
  end

  def update(conn, %{"id" => id, "section" => section_params}) do
    section = Repo.get(Section, id)
    changeset = Section.changeset(section, section_params)

    if changeset.valid? do
      section = Repo.update(changeset)
      render(conn, "show.json", section: section)
    else
      conn
      |> put_status(:unprocessable_entity)
      |> render(Scrummix.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    section = Repo.get(Section, id)

    section = Repo.delete(section)
    render(conn, "show.json", section: section)
  end
end

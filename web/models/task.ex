defmodule Scrummix.Task do
  use Scrummix.Web, :model

  import Ecto.Query

  schema "tasks" do
    field :label, :string
    field :position, :integer
    field :completed_at, Ecto.Time
    belongs_to :section, Scrummix.Section

    timestamps
  end

  @required_fields ~w(label position section_id)
  @optional_fields ~w(completed_at)

  def changeset(model, params \\ :empty) do
    unless params["position"] do
      position = max_position(params["section_id"]) |> Scrummix.Repo.one || 0
      params = Map.put(params, "position", position + 1)
    end
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def max_position(section_id) do
    __MODULE__
    |> where([t], t.section_id == ^section_id)
    |> select([t], max(t.position))
  end
end

defmodule Scrummix.Section do
  use Scrummix.Web, :model

  import Ecto.Query

  schema "sections" do
    field :label,     :string
    field :color,     :string
    field :position, :integer
    has_many :tasks, Scrummix.Task

    timestamps
  end

  @required_fields ~w(label color position)
  @optional_fields ~w()

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def all_with_tasks do
    __MODULE__ |> preload(:tasks)
  end

  def find_with_tasks(id) do
    __MODULE__
    |> where([s], s.id == ^id)
    |> preload(:tasks)
  end
end

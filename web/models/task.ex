defmodule Scrummix.Task do
  use Scrummix.Web, :model

  schema "tasks" do
    field :label, :string
    field :position, :integer
    field :completed_at, Ecto.Time
    belongs_to :section, Scrummix.Section

    timestamps
  end

  @required_fields ~w(label position completed_at)
  @optional_fields ~w()

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end

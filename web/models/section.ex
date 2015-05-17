defmodule Scrummix.Section do
  use Scrummix.Web, :model

  schema "sections" do
    field :label,     :string
    field :color,     :string
    field :position, :integer

    timestamps
  end

  @required_fields ~w(label color position)
  @optional_fields ~w()

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end

defmodule Scrummix.Repo.Migrations.CreateSection do
  use Ecto.Migration

  def change do
    create table(:sections) do
      add :label, :string
      add :color, :string
      add :position, :integer

      timestamps
    end

  end
end

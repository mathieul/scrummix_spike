defmodule Scrummix.Repo.Migrations.CreateTask do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :label, :string
      add :position, :integer
      add :completed_at, :timestamp
      add :section_id, :integer

      timestamps
    end
    create index(:tasks, [:section_id])

  end
end

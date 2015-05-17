defmodule Scrummix.Repo.Migrations.AddTestDataToSections do
  use Ecto.Migration
  use Timex

  def up do
    now = DateFormat.format!(Date.local, "{ISO}")

    Enum.each([
      {'Yesterday', 'teal', 1},
      {'Today', 'purple', 2},
      {'Impediments', 'orange', 3}
    ], fn {label, color, position} ->
      execute ~s"""
      INSERT INTO sections (label, color, position, inserted_at, updated_at)
        VALUES ('#{label}', '#{color}', #{position}, '#{now}', '#{now}');
      """
    end)
  end

  def down do
    execute "DELETE FROM sections;"
  end
end

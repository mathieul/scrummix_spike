defmodule Scrummix.TaskTest do
  use Scrummix.ModelCase

  alias Scrummix.Task

  @valid_attrs %{completed_at: %{hour: 14, min: 0}, label: "some content", position: 42, section: nil}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Task.changeset(%Task{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Task.changeset(%Task{}, @invalid_attrs)
    refute changeset.valid?
  end
end

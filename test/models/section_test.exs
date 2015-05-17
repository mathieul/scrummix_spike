defmodule Scrummix.SectionTest do
  use Scrummix.ModelCase

  alias Scrummix.Section

  @valid_attrs %{color: "some content", label: "some content", position: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Section.changeset(%Section{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Section.changeset(%Section{}, @invalid_attrs)
    refute changeset.valid?
  end
end

defmodule Scrummix.SectionControllerTest do
  use Scrummix.ConnCase

  alias Scrummix.Section
  @valid_params section: %{color: "some content", label: "some content", position: 42}
  @invalid_params section: %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "GET /sections", %{conn: conn} do
    conn = get conn, section_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "GET /sections/:id", %{conn: conn} do
    section = Repo.insert %Section{}
    conn = get conn, section_path(conn, :show, section)
    assert json_response(conn, 200)["data"] == %{
      "id" => section.id
    }
  end

  test "POST /sections with valid data", %{conn: conn} do
    conn = post conn, section_path(conn, :create), @valid_params
    assert json_response(conn, 200)["data"]["id"]
  end

  test "POST /sections with invalid data", %{conn: conn} do
    conn = post conn, section_path(conn, :create), @invalid_params
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "PUT /sections/:id with valid data", %{conn: conn} do
    section = Repo.insert %Section{}
    conn = put conn, section_path(conn, :update, section), @valid_params
    assert json_response(conn, 200)["data"]["id"]
  end

  test "PUT /sections/:id with invalid data", %{conn: conn} do
    section = Repo.insert %Section{}
    conn = put conn, section_path(conn, :update, section), @invalid_params
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "DELETE /sections/:id", %{conn: conn} do
    section = Repo.insert %Section{}
    conn = delete conn, section_path(conn, :delete, section)
    assert json_response(conn, 200)["data"]["id"]
    refute Repo.get(Section, section.id)
  end
end

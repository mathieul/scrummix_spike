defmodule Scrummix.TaskControllerTest do
  use Scrummix.ConnCase

  alias Scrummix.Task
  @valid_params task: %{completed_at: %{hour: 14, min: 0}, label: "some content", position: 42, section: nil}
  @invalid_params task: %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "GET /tasks", %{conn: conn} do
    conn = get conn, task_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "GET /tasks/:id", %{conn: conn} do
    task = Repo.insert %Task{}
    conn = get conn, task_path(conn, :show, task)
    assert json_response(conn, 200)["data"] == %{
      "id" => task.id
    }
  end

  test "POST /tasks with valid data", %{conn: conn} do
    conn = post conn, task_path(conn, :create), @valid_params
    assert json_response(conn, 200)["data"]["id"]
  end

  test "POST /tasks with invalid data", %{conn: conn} do
    conn = post conn, task_path(conn, :create), @invalid_params
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "PUT /tasks/:id with valid data", %{conn: conn} do
    task = Repo.insert %Task{}
    conn = put conn, task_path(conn, :update, task), @valid_params
    assert json_response(conn, 200)["data"]["id"]
  end

  test "PUT /tasks/:id with invalid data", %{conn: conn} do
    task = Repo.insert %Task{}
    conn = put conn, task_path(conn, :update, task), @invalid_params
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "DELETE /tasks/:id", %{conn: conn} do
    task = Repo.insert %Task{}
    conn = delete conn, task_path(conn, :delete, task)
    assert json_response(conn, 200)["data"]["id"]
    refute Repo.get(Task, task.id)
  end
end

defmodule Scrummix.TaskController do
  use Scrummix.Web, :controller

  alias Scrummix.Task

  plug :scrub_params, "task" when action in [:create, :update]
  plug :action

  def index(conn, _params) do
    tasks = Repo.all(Task)
    render(conn, "index.json", tasks: tasks)
  end

  def create(conn, %{"task" => task_params}) do
    changeset = Task.changeset(%Task{}, task_params)

    if changeset.valid? do
      task = Repo.insert(changeset)
      render(conn, "show.json", task: task)
    else
      conn
      |> put_status(:unprocessable_entity)
      |> render(Scrummix.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    task = Repo.get(Task, id)
    render conn, "show.json", task: task
  end

  def update(conn, %{"id" => id, "task" => task_params}) do
    task = Repo.get(Task, id)
    changeset = Task.changeset(task, task_params)

    if changeset.valid? do
      task = Repo.update(changeset)
      render(conn, "show.json", task: task)
    else
      conn
      |> put_status(:unprocessable_entity)
      |> render(Scrummix.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    task = Repo.get(Task, id)

    task = Repo.delete(task)
    render(conn, "show.json", task: task)
  end
end

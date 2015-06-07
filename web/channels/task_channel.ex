defmodule Scrummix.TaskChannel do
  use Scrummix.Web, :channel

  alias Scrummix.Repo
  alias Scrummix.Task

  @store_topic "tasks:store"

  def join(@store_topic, payload, socket) do
    IO.puts "join: #{inspect payload}"
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("add", p = %{"ref" => ref,"attributes" => attributes}, socket) do
    IO.puts "handle_in(add, #{inspect p}, ...)"
    changeset = Task.changeset(%Task{}, attributes)

    if changeset.valid? do
      task = Repo.insert(changeset)
      serialized = Phoenix.View.render(Scrummix.TaskView, "attributes.json", %{task: task})
      serialized = Map.put(serialized, :ref, ref)
      {:reply, {:ok, serialized}, socket}
    else
      serialized = Phoenix.View.render(Scrummix.ChangesetView, "error.json", changeset: changeset)
      serialized = Map.put(serialized, :ref, ref)
      {:reply, {:error, serialized}, socket}
    end
  end

  def handle_in("added", payload, socket) do
    Scrummix.Endpoint.broadcast_from! self, @store_topic, "added", payload
    {:no_reply, socket}
  end

  def handle_in("delete", %{"attributes" => %{"id" => task_id}}, socket) do
    if task = Repo.get(Task, task_id) do
      task = Repo.delete(task)
      serialized = Phoenix.View.render(Scrummix.TaskView, "attributes.json", %{task: task})
      {:reply, {:ok, serialized}, socket}
    else
      {:reply, {:ok, %{task: %{id: task_id}}}}
    end
  end

  def handle_out(event, payload, socket) do
    push socket, event, payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(payload) do
    payload["user_id"] == "user-todo" && payload["token"] == "todo-task-token"
  end
end

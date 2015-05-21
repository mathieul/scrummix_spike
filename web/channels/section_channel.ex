defmodule Scrummix.SectionChannel do
  use Scrummix.Web, :channel

  alias Scrummix.Repo
  alias Scrummix.Task

  @store_topic "sections:store"

  def join(@store_topic, payload, socket) do
    IO.puts "join: #{inspect payload}"
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("add_task", payload, socket) do
    changeset = Task.changeset(%Task{}, payload)

    if changeset.valid? do
      task = Repo.insert(changeset)
      serialized = Phoenix.View.render(Scrummix.TaskView, "show.json", %{task: task})
      {:reply, {:ok, serialized}, socket}
    else
      serialized = Phoenix.View.render(Scrummix.ChangesetView, "error.json", changeset: changeset)
      {:reply, {:error, serialized}, socket}
    end
  end

  def handle_in("task_added", payload, socket) do
    Scrummix.Endpoint.broadcast_from! self, @store_topic, "task_added", payload
    {:no_reply, socket}
  end

  def handle_out(event, payload, socket) do
    IO.puts ">>> handle_out(#{event}, #{inspect payload}) <<<"
    push socket, event, payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(payload) do
    payload["user_id"] == "user-todo" && payload["token"] == "todo-channel-token"
  end
end

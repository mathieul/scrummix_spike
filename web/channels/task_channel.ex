defmodule Scrummix.TaskChannel do
  use Scrummix.Web, :channel

  import Scrummix.ChannelUtils, only: [subtopic_to_section_id: 1]

  alias Scrummix.Repo
  alias Scrummix.Task

  @topic_prefix "tasks"

  def join(@topic_prefix <> subtopic, payload, socket) do
    if authorized?(payload) do
      socket = socket |> assign(:section_id, subtopic_to_section_id(subtopic))
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("fetch", _request, socket) do
    tasks = case socket.assigns[:section_id] do
              :all ->
                Repo.all(Task)
              section_id ->
                Repo.all(Task.with_section_id(section_id))
            end
    serialized = Phoenix.View.render(Scrummix.TaskView, "items.json", %{tasks: tasks})
    {:reply, {:ok, serialized}, socket}
  end

  def handle_in("add", %{"ref" => ref, "from" => from, "attributes" => attributes}, socket) do
    changeset = Task.changeset(%Task{}, attributes)

    if changeset.valid? do
      task = Repo.insert(changeset)
      serialized = Phoenix.View.render(Scrummix.TaskView, "attributes.json", %{task: task})
      serialized = Map.put(serialized, :ref, ref)
      publish_message("added", {task, serialized}, from)
      {:reply, {:ok, serialized}, socket}
    else
      serialized = Phoenix.View.render(Scrummix.ChangesetView, "error.json", changeset: changeset)
      serialized = Map.put(serialized, :ref, ref)
      {:reply, {:error, serialized}, socket}
    end
  end

  def handle_in("update", %{"ref" => ref, "from" => from, "attributes" => attributes}, socket) do
    if task = Repo.get(Task, attributes["id"]) do
      changeset = Task.changeset(task, attributes)
      if changeset.valid? do
        task = Repo.update(changeset)
      else
        content = Phoenix.View.render(Scrummix.ChangesetView, "error.json", changeset: changeset)
      end
      serialized = Phoenix.View.render(Scrummix.TaskView, "attributes.json", %{task: task})
      content = Map.merge(content || %{}, serialized)
    else
      content = %{errors: ["this task doesn't exist anymore"]}
    end

    content = Map.put(content, :ref, ref)
    if Map.has_key?(content, "errors") do
      {:reply, {:error, content}, socket}
    else
      publish_message("updated", {task, content}, from)
      {:reply, {:ok, content}, socket}
    end
  end

  def handle_in("delete", %{"from" => from, "attributes" => %{"id" => task_id}}, socket) do
    if task = Repo.get(Task, task_id) do
      task = Repo.delete(task)
      serialized = Phoenix.View.render(Scrummix.TaskView, "attributes.json", %{task: task})
      publish_message("deleted", {task, serialized}, from)
      {:reply, {:ok, serialized}, socket}
    else
      {:reply, {:ok, %{task: %{id: task_id}}}}
    end
  end

  def handle_in(kind, _payload, socket) do
    message = "task " <> kind <> " operation is not implemented"
    IO.puts message
    {:reply, {:error, message}, socket}
  end

  def handle_out(event, payload, socket) do
    push socket, event, payload
    {:noreply, socket}
  end

  defp publish_message(kind, {task, content}, from) do
    payload = Map.put(content, "from", from)
    Scrummix.Endpoint.broadcast("#{@topic_prefix}:all", kind, payload)
    Scrummix.Endpoint.broadcast("#{@topic_prefix}:section_id=#{task.section_id}", kind, payload)
  end

  # Add authorization logic here as required.
  defp authorized?(payload) do
    payload["user_id"] == "user-todo" && payload["token"] == "todo-scrummix-token"
  end
end

defmodule Scrummix.SectionChannel do
  use Scrummix.Web, :channel

  import Scrummix.ChannelUtils, only: [subtopic_to_section_id: 1]

  alias Scrummix.Repo
  alias Scrummix.Section

  @topic_prefix "sections"

  def join(@topic_prefix <> subtopic, payload, socket) do
    if authorized?(payload) do
      socket = socket |> assign(:section_id, subtopic_to_section_id(subtopic))
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("fetch", _request, socket) do
    sections = case socket.assigns[:section_id] do
                 :all ->
                   Repo.all(Section)
                 section_id ->
                   Repo.all(Section.with_id(section_id))
               end
    serialized = Phoenix.View.render(Scrummix.SectionView, "items.json", %{sections: sections})
    {:reply, {:ok, serialized}, socket}
  end

  def handle_in(kind, _payload, socket) do
    message = "section " <> kind <> " operation is not implemented"
    IO.puts message
    {:reply, {:error, message}, socket}
  end

  def handle_out(event, payload, socket) do
    push socket, event, payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(payload) do
    payload["user_id"] == "user-todo" && payload["token"] == "todo-scrummix-token"
  end
end

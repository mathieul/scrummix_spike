defmodule Scrummix.SectionChannel do
  use Scrummix.Web, :channel

  def join("sections:store", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("front_msg", payload, socket) do
    broadcast socket, "front_msg", payload
    {:noreply, socket}
  end

  def handle_out(event, payload, socket) do
    push socket, event, %{body: "sending payload", payload: payload}
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end

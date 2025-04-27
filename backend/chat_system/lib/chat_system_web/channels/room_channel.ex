defmodule ChatSystemWeb.RoomChannel do
  use ChatSystemWeb, :channel

  @impl true
  def join("room:lobby", _params, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("message:new", %{"body" => body}, socket) do
    broadcast!(socket, "message:new", %{
      user: socket.assigns.username,
      body: body
    })

    {:noreply, socket}
  end
end

defmodule ChatSystemWeb.RoomChannel do
  use Phoenix.Channel

  # users trying to join the channel.
  def join("room:" <> _room_id, _params, socket) do
    {:ok, socket}
  end

  # new msgs
  def handle_in("message:new", %{"body" => body}, socket) do
    broadcast!(socket, "message:new", %{user: socket.assigns.username, body: body})
    {:noreply, socket}
  end


end

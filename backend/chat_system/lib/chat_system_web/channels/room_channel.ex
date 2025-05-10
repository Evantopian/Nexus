defmodule ChatSystemWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:" <> _room_name, _params, socket) do
    {:ok, socket}
  end

  def join("dm:" <> _username, _params, socket) do
    {:ok, socket}
  end

  def handle_in("message:new", %{"user" => user, "body" => body}, socket) do
    broadcast!(socket, "message:new", %{
      user: user,
      body: body,
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    })

    {:noreply, socket}
  end

  def handle_in("typing:start", %{"user" => user}, socket) do
    broadcast_from!(socket, "typing:start", %{user: user})
    {:noreply, socket}
  end

  def handle_in("typing:stop", %{"user" => user}, socket) do
    broadcast_from!(socket, "typing:stop", %{user: user})
    {:noreply, socket}
  end
end

defmodule ChatSystemWeb.UserSocket do
  use Phoenix.Socket

  # Channels
  channel "room:*", ChatSystemWeb.RoomChannel

  # Transport
  transport :websocket, Phoenix.Transports.WebSocket

  
  # temp as we need to verify future tokens for auth
  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    username = "User#{Enum.random(1000..9999)}"
    {:ok, assign(socket, :username, username)}
  end

  @impl true
  def id(_socket), do: nil
end

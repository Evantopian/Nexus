defmodule ChatSystemWeb.UserSocket do
  use Phoenix.Socket

  # channels
  channel "room:*", ChatSystemWeb.RoomChannel
  channel "dm:*",   ChatSystemWeb.RoomChannel

  def connect(%{"username" => username}, socket, _connect_info) do
    {:ok, assign(socket, :username, username)}
  end

  def id(_socket), do: nil
end

# lib/chat_system_web/user_socket.ex

defmodule ChatSystemWeb.UserSocket do
  use Phoenix.Socket

  channel "dm:*", ChatSystemWeb.DirectChannel
  # Comment this out for now if it's incomplete or broken:
  # channel "room:*", ChatSystemWeb.RoomChannel

  def connect(%{"user_id" => user_id}, socket, _connect_info) do
    {:ok, assign(socket, :user_id, user_id)}
  end

  def id(_socket), do: nil
end

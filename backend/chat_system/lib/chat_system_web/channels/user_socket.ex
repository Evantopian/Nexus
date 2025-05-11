### lib/chat_system_web/user_socket.ex

defmodule ChatSystemWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "room:*", ChatSystemWeb.RoomChannel
  channel "dm:*", ChatSystemWeb.RoomChannel

  # Temporarily accept all connections without token validation
  def connect(%{"token" => token}, socket, _connect_info) do
    # You can optionally log it
    IO.inspect(token, label: "Dev Token Bypass")
    {:ok, assign(socket, :user_id, "7e213f36-b3f8-4c9d-8faf-390a41d550d4")}

  end

  def id(_socket), do: nil
end

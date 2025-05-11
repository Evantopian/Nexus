defmodule ChatSystemWeb.UserSocket do
  use Phoenix.Socket

  alias ChatSystem.Auth

  # Channels
  channel "room:*", ChatSystemWeb.RoomChannel
  channel "dm:*", ChatSystemWeb.RoomChannel

  # Connect with token from frontend
  def connect(%{"token" => token}, socket, _connect_info) do
    with {:ok, claims} <- Auth.verify_token(token),
         %{"sub" => user_id} <- claims do
      {:ok, assign(socket, :user_id, user_id)}
    else
      _ -> :error
    end
  end

  def id(_socket), do: nil
end

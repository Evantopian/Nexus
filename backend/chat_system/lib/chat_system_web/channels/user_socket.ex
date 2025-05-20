defmodule ChatSystemWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "dm:*", ChatSystemWeb.ChatChannel
  # future:
  # channel "group:*", ChatSystemWeb.ChatChannel
  # channel "server:*", ChatSystemWeb.ChatChannel

  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    # TODO: verify token or load user info if needed
    {:ok, assign(socket, :user_token, token)}
  end

  @impl true
  def id(_socket), do: nil
end

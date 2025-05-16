defmodule ChatSystemWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "dm:*", ChatSystemWeb.ChatChannel
  # future:
  # channel "group:*", ChatSystemWeb.ChatChannel
  # channel "server:*", ChatSystemWeb.ChatChannel

  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    # Ideally look up user info from the token:
    # %{id: user_id, username: username} = lookup_user(token)

    {:ok,
    socket
    |> assign(:user_token, token)
    |> assign(:user_id, token) # TEMP, replace with actual lookup
    |> assign(:username, "Unknown")}
  end

  @impl true
  def id(_socket), do: nil
end

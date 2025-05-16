defmodule ChatSystemWeb.ChatChannel do
  use Phoenix.Channel

  @impl true
  def join("dm:" <> conversation_id, _params, socket) do
    # TODO: optionally verify user is a participant via your Go API
    {:ok, assign(socket, :conversation_id, conversation_id)}
  end

  # catch-all for other prefixes (not yet implemented)
  @impl true
  def join(topic, _params, _socket) do
    cond do
      String.starts_with?(topic, "group:")  -> {:error, %{reason: "group chat not ready"}}
      String.starts_with?(topic, "server:") -> {:error, %{reason: "server channels not ready"}}
      true                                   -> {:error, %{reason: "unknown topic"}}
    end
  end

  @impl true
  def handle_in("message:new", %{"body" => body} = payload, socket) do
    conversation_id = socket.assigns[:conversation_id]
    user_id = socket.assigns[:user_id] || "anonymous"
    username = socket.assigns[:username] || "Unknown"

    enriched_payload = %{
      "id" => Ecto.UUID.generate(),
      "body" => body,
      "conversation_id" => conversation_id,
      "sender_id" => user_id,
      "username" => username,
      "timestamp" => DateTime.utc_now() |> DateTime.to_iso8601()
    }

    IO.inspect(enriched_payload, label: "💥 Broadcasting enriched message")

    broadcast!(socket, "message:new", enriched_payload)
    {:noreply, socket}
  end



  # stub for future edits
  @impl true
  def handle_in("message:edit", payload, socket) do
    broadcast!(socket, "message:edit", payload)
    {:noreply, socket}
  end

  @impl true
  def terminate(_reason, socket) do
    # cleanup if you track presence, etc.
    {:stop, :normal, socket}
  end
end

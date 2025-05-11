defmodule ChatSystemWeb.RoomChannel do
  use Phoenix.Channel

  alias ChatSystem.Chat

  # Join a server channel (e.g., room:channel_id)
  def join("room:" <> channel_id, _params, socket) do
    {:ok, assign(socket, :channel_id, channel_id)}
  end

  # Join a DM channel (e.g., dm:conversation_id)
  def join("dm:" <> conversation_id, _params, socket) do
    {:ok, assign(socket, :conversation_id, conversation_id)}
  end

  # Handle new messages
  def handle_in("message:new", %{"body" => body}, socket) do
    user_id = socket.assigns.user_id

    # Determine type of channel
    topic = socket.topic

    attrs =
      case topic do
        "dm:" <> conversation_id ->
          %{
            body: body,
            user_id: user_id,
            conversation_id: conversation_id
          }

        "room:" <> channel_id ->
          %{
            body: body,
            user_id: user_id,
            channel_id: channel_id
          }

        _ ->
          %{}
      end

    case Chat.create_message(attrs) do
      {:ok, msg} ->
        broadcast!(socket, "message:new", %{
          id: msg.id,
          body: msg.body,
          user_id: msg.user_id,
          conversation_id: msg.conversation_id,
          channel_id: msg.channel_id,
          timestamp: msg.inserted_at
        })


      {:error, changeset} ->
        IO.inspect(changeset, label: "Message insert failed")
    end

    {:noreply, socket}
  end

  # Handle typing indicators
  def handle_in("typing:start", %{}, socket) do
    user_id = socket.assigns.user_id
    broadcast_from!(socket, "typing:start", %{user_id: user_id})
    {:noreply, socket}
  end

  def handle_in("typing:stop", %{}, socket) do
    user_id = socket.assigns.user_id
    broadcast_from!(socket, "typing:stop", %{user_id: user_id})
    {:noreply, socket}
  end
end

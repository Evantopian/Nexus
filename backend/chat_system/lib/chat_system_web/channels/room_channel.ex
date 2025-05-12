defmodule ChatSystemWeb.RoomChannel do
  use Phoenix.Channel
  require Logger

  alias ChatSystem.Chat
  alias Ecto.UUID

  # join a text-channel
  def join("room:" <> cid, _params, socket) do
    with {:ok, _} <- ensure_channel_exists(cid) do
      history = Chat.list_channel_messages(cid)
      socket  = assign(socket, :channel_id, cid)
      {:ok, %{messages: render(history)}, socket}
    else
      {:error, reason} -> {:error, %{reason: reason}}
    end
  end

  # join a DM
  def join("dm:" <> other_id, _params, socket) do
    me = socket.assigns.user_id

    case Chat.get_or_create_conversation(me, other_id) do
      {:ok, bin_id} ->
        convo_id = UUID.load!(bin_id)
        history  = Chat.list_conversation_messages(convo_id)
        socket   = assign(socket, :conversation_id, convo_id)
        {:ok, %{conversation_id: convo_id, messages: render(history)}, socket}

      {:error, _} ->
        Logger.error("DM join failed: #{me} ↔ #{other_id}")
        {:error, %{reason: "cannot start DM"}}
    end
  end

  # handle new messages for both rooms & DMs
  def handle_in("message:new", %{"body" => body}, socket) do
    attrs =
      case socket.topic do
        "room:" <> cid -> %{body: body, sender_id: socket.assigns.user_id, channel_id: cid}
        "dm:"   <> cn  -> %{body: body, sender_id: socket.assigns.user_id, conversation_id: cn}
      end

    case Chat.create_message(attrs) do
      {:ok, msg} ->
        broadcast!(socket, "message:new", %{
          id:              msg.id,
          body:            msg.body,
          user_id:         msg.sender_id,
          channel_id:      msg.channel_id,
          conversation_id: msg.conversation_id,
          created_at:      msg.created_at
        })

        {:noreply, socket}

      {:error, cs} ->
        push(socket, "message:error", %{errors: Ecto.Changeset.traverse_errors(cs, & &1)})
        {:noreply, socket}
    end
  end

  # helper: rescue when a channel id isn’t found
  defp ensure_channel_exists(cid) do
    try do
      Chat.get_channel!(cid)
      {:ok, cid}
    rescue
      Ecto.NoResultsError -> {:error, "channel not found"}
    end
  end

  # render your messages, returning created_at (instead of inserted_at)
  defp render(messages) do
    for m <- messages do
      %{
        id:              m.id,
        body:            m.body,
        user_id:         m.sender_id,
        channel_id:      m.channel_id,
        conversation_id: m.conversation_id,
        created_at:      m.created_at,
        pinned:          m.pinned
      }
    end
  end
end

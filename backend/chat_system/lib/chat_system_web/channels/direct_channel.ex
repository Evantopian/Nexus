# lib/chat_system_web/channels/direct_channel.ex
defmodule ChatSystemWeb.DirectChannel do
  use Phoenix.Channel
  alias ChatSystem.DMs
  
  
  def join("dm:" <> raw_other_id, _params, %{assigns: %{user_id: raw_my_id}} = socket) do
    with {:ok, my_id} <- Ecto.UUID.cast(raw_my_id),
        {:ok, other_id} <- Ecto.UUID.cast(raw_other_id),
        {:ok, convo} <- DMs.find_or_create_direct_conversation(my_id, other_id) do

      messages = DMs.list_messages(convo.id)

      socket =
        socket
        |> assign(:conversation_id, convo.id)
        |> assign(:conversation, convo)

      {:ok, %{messages: messages}, socket}
    else
      _ -> {:error, %{reason: "invalid_user_id_format"}}
    end
  end




  def handle_in("message:new", %{"body" => body}, socket) do
    my_id = socket.assigns.user_id
    convo_id = socket.assigns.conversation_id

    case DMs.create_message(%{
          sender_id: my_id,
          body: body,
          conversation_id: convo_id
        }) do
      {:ok, msg} ->
        broadcast!(socket, "message:new", %{
          id: msg.id,
          body: msg.body,
          user_id: msg.sender_id,
          conversation_id: msg.conversation_id,
          created_at: msg.created_at
        })

        {:noreply, socket}

      {:error, reason} ->
        {:reply, {:error, reason}, socket}
    end
  end

end

defmodule ChatSystemWeb.ChatLive do
  use ChatSystemWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket), do: Phoenix.PubSub.subscribe(ChatSystem.PubSub, "chat_room")

    {:ok,
     assign(socket,
       messages: [],
       username: "User#{Enum.random(1000..9999)}",
       message: ""
     )}
  end

  @impl true
  def handle_event("send", %{"message" => message}, socket) do
    Phoenix.PubSub.broadcast(ChatSystem.PubSub, "chat_room", {:new_message, %{user: socket.assigns.username, body: message}})
    {:noreply, assign(socket, :message, "")}
  end

  @impl true
  def handle_info({:new_message, %{user: user, body: body}}, socket) do
    new_message = %{user: user, body: body}
    {:noreply, update(socket, :messages, fn msgs -> msgs ++ [new_message] end)}
  end
end

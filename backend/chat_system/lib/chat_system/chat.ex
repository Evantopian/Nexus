### lib/chat_system/chat.ex

defmodule ChatSystem.Chat do
  alias ChatSystem.Messages.Message
  alias ChatSystem.Repo

  def create_message(attrs) do
    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
  end
  
  
  alias ChatSystem.Conversations.{Conversation, ConversationParticipant}

  def create_conversation(participant_ids) when is_list(participant_ids) do
    Repo.transaction(fn ->
      {:ok, convo} =
        %Conversation{}
        |> Conversation.changeset(%{})
        |> Repo.insert()

      participants =
        Enum.map(participant_ids, fn user_id ->
          %ConversationParticipant{}
          |> ConversationParticipant.changeset(%{
            conversation_id: convo.id,
            user_id: user_id
          })
        end)

      Enum.each(participants, &Repo.insert!/1)
      convo
    end)
  end

end

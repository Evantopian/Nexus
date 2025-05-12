defmodule ChatSystem.DMs do
  @moduledoc "Context for handling direct messages between users"

  import Ecto.Query
  alias ChatSystem.Repo

  alias ChatSystem.DMs.{
    Conversation,
    ConversationParticipant,
    Message
  }

  # -- Finds or creates a direct conversation between two users --
  def find_or_create_direct_conversation(user_id1, user_id2) do
    ids = Enum.sort([user_id1, user_id2])

    query =
      from c in Conversation,
        join: p1 in assoc(c, :participants),
        join: p2 in assoc(c, :participants),
        where: p1.user_id == ^hd(ids) and p2.user_id == ^List.last(ids),
        limit: 1

    case Repo.one(query) do
      nil -> create_conversation_with_participants(ids)
      convo -> {:ok, convo}
    end
  end

  defp create_conversation_with_participants([id1, id2]) do
    %Conversation{}
    |> Conversation.changeset(%{})
    |> Repo.insert()
    |> case do
      {:ok, convo} ->
        Repo.insert_all(ConversationParticipant, [
          %{conversation_id: convo.id, user_id: id1},
          %{conversation_id: convo.id, user_id: id2}
        ])
        {:ok, convo}

      error -> error
    end
  end
  def create_message(attrs) do
    IO.inspect(attrs, label: "🚨 Incoming message attrs")

    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
  end



  def list_messages(conversation_id) do
    from(m in Message,
      where: m.conversation_id == ^conversation_id,
      order_by: [asc: m.created_at]   # ✅ use created_at instead of inserted_at
    )
    |> Repo.all()
  end

end

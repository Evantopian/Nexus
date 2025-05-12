defmodule ChatSystem.DMs.ConversationParticipant do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  schema "conversation_participants" do
    field :user_id, :binary_id
    belongs_to :conversation, ChatSystem.DMs.Conversation, type: :binary_id
  end

  def changeset(participant, attrs) do
    participant
    |> cast(attrs, [:user_id, :conversation_id])
    |> validate_required([:user_id, :conversation_id])
  end
end

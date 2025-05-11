defmodule ChatSystem.Conversations.ConversationParticipant do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  @foreign_key_type :binary_id

  schema "conversation_participants" do
    field :conversation_id, :binary_id
    field :user_id, :binary_id
  end

  def changeset(cp, attrs) do
    cp
    |> cast(attrs, [:conversation_id, :user_id])
    |> validate_required([:conversation_id, :user_id])
  end
end

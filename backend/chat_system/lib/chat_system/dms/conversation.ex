defmodule ChatSystem.DMs.Conversation do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "conversations" do
    has_many :participants, ChatSystem.DMs.ConversationParticipant
    has_many :messages, ChatSystem.DMs.Message
  end

  def changeset(conversation, attrs) do
    conversation
    |> cast(attrs, [])
    |> validate_required([])
  end
end

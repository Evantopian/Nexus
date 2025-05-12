defmodule ChatSystem.Conversations.Conversation do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "conversations" do
    field :type, :string  # optional if used
  end

  def changeset(conversation, attrs) do
    conversation
    |> cast(attrs, [:type])
  end
end

defmodule ChatSystem.Messages.Message do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "messages" do
    field :body, :string
    field :sender_id, Ecto.UUID            
    field :conversation_id, Ecto.UUID
    field :channel_id, Ecto.UUID
    field :pinned, :boolean, default: false

  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:body, :sender_id, :conversation_id, :channel_id, :pinned])  # ✅ use sender_id
    |> validate_required([:body, :sender_id])                                   # ✅ require sender_id
  end
end

defmodule ChatSystem.Chat.Message do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "messages" do
    field :body, :string
    field :user_id, :binary_id
    field :conversation_id, :binary_id
    field :channel_id, :binary_id
    field :reply_to_id, :binary_id
    field :pinned, :boolean, default: false

    timestamps()
  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:body, :user_id, :conversation_id, :channel_id, :reply_to_id, :pinned])
    |> validate_required([:body, :user_id])
  end
end

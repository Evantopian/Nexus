defmodule ChatSystem.DMs.Message do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :body, :sender_id, :conversation_id, :created_at]}
  @primary_key {:id, :binary_id, autogenerate: true}
  schema "messages" do
    field :body, :string
    field :sender_id, :binary_id
    field :conversation_id, :binary_id

    timestamps(inserted_at: :created_at, updated_at: false)
  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:body, :sender_id, :conversation_id])
    |> validate_required([:body, :sender_id, :conversation_id])
  end
end

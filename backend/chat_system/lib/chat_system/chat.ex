defmodule ChatSystem.Chat do
  import Ecto.Query, warn: false
  alias ChatSystem.Repo

  alias ChatSystem.Chat.Message

  def create_message(attrs) do
    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
  end
end

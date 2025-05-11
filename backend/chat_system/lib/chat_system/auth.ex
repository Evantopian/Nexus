defmodule ChatSystem.Auth do
  use Joken.Config

  @impl true
  def token_config do
    default_claims(skip: [:aud, :iss])
    |> add_claim("uuid", nil, &is_binary/1)
  end

  def verify_token(token) do
    secret = System.get_env("JWT_SECRET_KEY") || raise "JWT_SECRET_KEY not set"
    signer = Joken.Signer.create("HS256", secret)

    case verify_and_validate(token, signer) do
      {:ok, claims} -> {:ok, claims}
      {:error, _reason} -> {:error, :unauthorized}
    end
  end
end

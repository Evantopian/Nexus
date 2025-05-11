defmodule ChatSystem.Auth do
  use Joken.Config

  @impl true
  def token_config do
    # Create a very permissive configuration that will accept tokens
    # from your Go backend without strict claim validation
    default_claims(skip: [:aud, :iss, :jti, :nbf])
    # Don't add specific required claims here as your Go backend 
    # might use different claim names
  end

  def verify_token(token) do
    # Get the secret from application config instead of env directly
    secret = Application.get_env(:chat_system, :jwt_secret_key) || 
             System.get_env("JWT_SECRET_KEY") || 
             raise "JWT_SECRET_KEY not set"
             
    signer = Joken.Signer.create("HS256", secret)

    case verify_and_validate(token, signer) do
      {:ok, claims} -> {:ok, claims}
      {:error, reason} -> 
        require Logger
        Logger.error("JWT validation error: #{inspect(reason)}")
        {:error, :unauthorized}
    end
  end
  
  # Helper function to extract user ID from claims with fallbacks
  # for different possible claim names used by Go backend
  def extract_user_id(claims) do
    claims["sub"] || claims["uuid"] || claims["user_id"] || 
    claims["id"] || claims["userId"] || nil
  end
end
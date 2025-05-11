import Config

env_path = Path.expand("../../.env", __DIR__)

if File.exists?(env_path) do
  IO.puts("Loading environment variables from #{env_path}")
  :ok = DotenvParser.load_file(env_path)
else
  IO.puts("No .env file found at #{env_path}")
end

# Log secret status for debugging
IO.puts("JWT_SECRET_KEY is #{if System.get_env("JWT_SECRET_KEY"), do: "set", else: "NOT set"}")

# Always configure the JWT secret
jwt_secret = System.get_env("JWT_SECRET_KEY")

if jwt_secret do
  config :chat_system, jwt_secret_key: jwt_secret
  IO.puts("JWT secret key configured successfully")
else
  IO.puts("WARNING: JWT_SECRET_KEY environment variable is not set")

  if config_env() == :prod do
    raise "JWT_SECRET_KEY environment variable is missing in production"
  else
    # Provide a fallback secret in dev/test
    fallback = "dev_secret_key_#{config_env()}"
    config :chat_system, jwt_secret_key: fallback
    IO.puts("Using default JWT secret for #{config_env()} environment")
  end
end

config :chat_system, ChatSystem.Repo,
  migration_primary_key: [type: :binary_id],
  migration_foreign_key: [type: :binary_id]



# === Production-specific configuration ===

if config_env() == :prod do
  database_url =
    System.get_env("POSTGRES_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  maybe_ipv6 = if System.get_env("ECTO_IPV6") in ~w(true 1), do: [:inet6], else: []

  config :chat_system, ChatSystem.Repo,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
    socket_options: maybe_ipv6

  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host = System.get_env("PHX_HOST") || "example.com"
  port = String.to_integer(System.get_env("PORT") || "4000")

  config :chat_system, :dns_cluster_query, System.get_env("DNS_CLUSTER_QUERY")

  config :chat_system, ChatSystemWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [ip: {0, 0, 0, 0, 0, 0, 0, 0}, port: port],
    secret_key_base: secret_key_base
end

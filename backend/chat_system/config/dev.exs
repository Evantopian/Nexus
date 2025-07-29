import Config

# Configure your database
config :chat_system, ChatSystem.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "chat_system_dev",
  stacktrace: true,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

# For development, we disable any cache and enable
# debugging and code reloading.
config :chat_system, ChatSystemWeb.Endpoint,
  # Binding to loopback ipv4 address prevents access from other machines.
  http: [ip: {127, 0, 0, 1}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: System.fetch_env!("SECRET_KEY_BASE")
  # Temporarily comment this out unless you want to enforce SSL in dev:
  # force_ssl: [hsts: true], 
 

# ## SSL Support
#
# Uncomment this block if you want to use HTTPS locally (development)
#
# mix phx.gen.cert
#
# config :chat_system, ChatSystemWeb.Endpoint,
#   https: [
#     port: 4001,
#     cipher_suite: :strong,
#     keyfile: "priv/cert/selfsigned_key.pem",
#     certfile: "priv/cert/selfsigned.pem"
#   ]

# Watch static and templates for browser reloading.
config :chat_system, ChatSystemWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r"priv/static/(?!uploads/).*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"priv/gettext/.*(po)$",
      ~r"lib/chat_system_web/(controllers|live|components)/.*(ex|heex)$"
    ]
  ]

# Enable dev routes for dashboard and mailbox
config :chat_system, dev_routes: true

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

config :phoenix_live_view,
  # Include HEEx debug annotations as HTML comments in rendered markup
  debug_heex_annotations: true,
  # Enable helpful, but potentially expensive runtime checks
  enable_expensive_runtime_checks: true

# Disable swoosh api client as it is only required for production adapters.
config :swoosh, :api_client, false

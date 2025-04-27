defmodule ChatSystemWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :chat_system

  @session_options [
    store: :cookie,
    key: "_chat_system_key",
    signing_salt: "q24k0DZf",
    same_site: "Lax"
  ]

  # Mount your chat socket
  socket "/socket", ChatSystemWeb.UserSocket,
    websocket: true,
    longpoll: false

  # Serve static files from "priv/static" directory
  plug Plug.Static,
    at: "/",
    from: :chat_system,
    gzip: false,
    only: ~w(assets fonts images favicon.ico robots.txt)

  # Enable code reloading in development
  if code_reloading? do
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :chat_system
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug ChatSystemWeb.Router
end

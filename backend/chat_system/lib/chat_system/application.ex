defmodule ChatSystem.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      ChatSystemWeb.Telemetry,
      ChatSystem.Repo,
      {DNSCluster, query: Application.get_env(:chat_system, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: ChatSystem.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: ChatSystem.Finch},
      # Start a worker by calling: ChatSystem.Worker.start_link(arg)
      # {ChatSystem.Worker, arg},
      # Start to serve requests, typically the last entry
      ChatSystemWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ChatSystem.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    ChatSystemWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end

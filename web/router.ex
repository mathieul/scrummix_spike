defmodule Scrummix.Router do
  use Scrummix.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
  end

  scope "/", Scrummix do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    scope "/daily" do
      get "/", DailyController, :index
      get "/edit/:section_id", DailyController, :edit
    end
  end

  socket "/ws", Scrummix do
    channel "sections:*", SectionChannel
    channel "tasks:*", TaskChannel
  end
end

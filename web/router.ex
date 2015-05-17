defmodule Scrummix.Router do
  use Scrummix.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Scrummix do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/api", Scrummix do
    pipe_through :api

    resources "/sections", SectionController, except: [:new, :edit]
    resources "/tasks", TaskController, except: [:new, :edit]
  end
end

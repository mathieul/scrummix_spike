defmodule Scrummix.ChannelUtils do
  def subtopic_to_section_id(subtopic) do
    case String.split(subtopic, "section_id=") do
      [":", string_id] ->
        String.to_integer(string_id)
      _ ->
        :all
    end
  end
end

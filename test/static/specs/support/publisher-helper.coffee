class Publisher
  constructor: ->
    @callbacks = {}
    @events = {}

  join: -> this

  receive: (status, cb) ->
    @callbacks[status] = cb
    this

  send: (status, response) ->
    if cb = @callbacks[status]
      cb(response)

  on: (name, cb) ->
    @events[name] = cb
    this

  trigger: (name, payload) ->
    if event = @events[name]
      event(payload)

module.exports = Publisher

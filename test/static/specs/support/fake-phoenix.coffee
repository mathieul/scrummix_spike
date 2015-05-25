class Push
  constructor: (@payload) ->
    @callbacks = {}

  after: ->
    this

  receive: (status, cb) ->
    @callbacks[status] = cb
    this

  RECEIVE: (status, response) ->
    if cb = @callbacks[status]
      cb(response)

class Channel
  constructor: ->
    @callbacks = {}
    @events    = {}
    @pushes    = {}

  join: -> this

  receive: (status, cb) ->
    @callbacks[status] = cb
    this

  RECEIVE: (status, response) ->
    if cb = @callbacks[status]
      cb(response)

  on: (name, cb) ->
    @events[name] = cb
    this

  ON: (name, payload) ->
    if event = @events[name]
      event(payload)

  push: (name, payload) ->
    @pushes[name] = new Push(payload)

class Socket
  constructor: ->
    @channels = {}

  connect: -> this
  onError: -> this
  onClose: -> this

  chan: (name) ->
    @channels[name] = new Channel

module.exports =
  Socket:   Socket
  Channel:  Channel
  Push:     Push

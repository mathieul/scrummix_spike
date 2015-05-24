Publisher = require 'test/support/publisher-helper'
Base = require 'scrummix/stores/base'
{Socket} = require 'phoenix'

describe "stores/base", ->
  socket = null
  channel = null
  chanStub = null

  beforeEach ->
    socket = sinon.createStubInstance(Socket)
    chanStub = sinon.stub(socket, 'chan').returns(channel = new Publisher)

  describe ".createStore()", ->
    it "creates a Reflux store", ->
      store = Base.createStore('collection', 'model', {})
      expect(typeof store.listen).to.equal 'function'

  describe ".socket", ->
    it "opens a channel with the collection", ->
      store = Base.createStore('things', 'thing', {})
      store.setSocket(socket);
      expect(chanStub).to.have.been.calledWith('things:store', {})

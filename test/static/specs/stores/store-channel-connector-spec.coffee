Publisher = require 'test/support/publisher-helper'
Connector = require 'scrummix/stores/store-channel-connector'
{Socket} = require 'phoenix'

describe "stores/store-channel-connector", ->
  socket = null
  channel = null
  chanStub = null
  Thing = Immutable.Record({id: null, name: null})

  beforeEach ->
    socket = sinon.createStubInstance(Socket)
    chanStub = sinon.stub(socket, 'chan').returns(channel = new Publisher)

  describe "connectChannelMixin()", ->
    subject = null

    beforeEach ->
      subject = Object.assign((->), Connector.connectChannelMixin('things', Thing))
      subject.init()

    it "has an empty collection by default", ->
      expect(subject.collection().isEmpty()).to.be.true

    describe "setSocket()", ->
      it "can set the socket to start listening to channel", ->
        subject.setSocket(socket)
        expect(chanStub).to.have.been.calledWith('things:store', {})

    describe "pushPayload()", ->
      it "initializes the collection to empty if none present in payload", ->
        subject.pushPayload({stuff: [{id: 1, name: "foo"}]})
        expect(subject.collection().isEmpty()).to.be.true

      it "initializes the collection if present in payload", ->
        subject.pushPayload({stuff: [], things: [{id: 42, name: "allo"}, {id: 33, name: "la terre"}]})
        collection = subject.collection()
        expect(collection.size).to.equal 2
        expect(collection.map((v) -> v.name).toArray()).to.have.members ["allo", "la terre"]

      it "instantiates a model instance for each item of the collection", ->
        subject.pushPayload({things: [{id: 42, name: "allo"}]})
        expect(subject.collection().first().constructor).to.equal Thing


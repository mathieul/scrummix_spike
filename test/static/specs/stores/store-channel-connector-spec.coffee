Connector = require 'scrummix/stores/store-channel-connector'
{Socket} = require 'test/support/fake-phoenix'

describe "stores/store-channel-connector", ->
  socket = null
  subject = null
  Thing = Immutable.Record({id: null, name: null})

  beforeEach ->
    socket = new Socket()
    subject = Object.assign((->), Connector.connectChannelMixin('things', Thing))
    subject.init()

  describe "connectChannelMixin()", ->
    it "has an empty collection by default", ->
      expect(subject.collection.isEmpty()).to.be.true

    describe "setSocket()", ->
      it "can set the socket to start listening to channel", ->
        chanSpy = sinon.spy(socket, 'chan')
        subject.setSocket(socket)
        expect(chanSpy).to.have.been.calledWith('things:store', {})

    describe "pushPayload()", ->
      it "initializes the collection to empty if none present in payload", ->
        subject.pushPayload({stuff: [{id: 1, name: "foo"}]})
        expect(subject.collection.isEmpty()).to.be.true

      it "initializes the collection if present in payload", ->
        subject.pushPayload({stuff: [], things: [{id: 42, name: "allo"}, {id: 33, name: "la terre"}]})
        expect(subject.collection.size).to.equal 2
        expect(subject.collection.map((v) -> v.name).toArray()).to.have.members ["allo", "la terre"]

      it "instantiates a model instance for each item of the collection", ->
        subject.pushPayload({things: [{id: 42, name: "allo"}]})
        expect(subject.collection.first().constructor).to.equal Thing

  describe "add an item", ->
    beforeEach -> subject.setSocket(socket)

    it "inserts an item in the collection", ->
      item = subject.addItem({name: "hello"})
      expect(subject.collection.first()).to.equal item
      expect(item.get('id')).to.not.be.empty
      expect(item.get('name')).to.equal "hello"

    it "inserts a pending operation", ->
      item = subject.addItem({name: "hello"})
      expect(subject.pending.size).to.equal 1
      operation = subject.pending.first()
      expect(operation.get('type')).to.equal 'add'
      expect(operation.get('id')).to.equal item.get('id')

    it "sends an add request through the channel", ->
      pushSpy = sinon.spy(socket.channels['things:store'], 'push')
      item = subject.addItem({name: "hello"})
      expect(pushSpy).to.have.been.calledWith 'add_item',
        ref: item.id
        attributes:
          name: "hello"


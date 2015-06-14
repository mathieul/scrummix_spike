ChannelStoreBase = require 'scrummix/util/channel-store-base'
alt              = require 'scrummix/util/alt'
{Socket}         = require 'test/support/fake-phoenix'

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

Thing = Immutable.Record({id: null, name: null})

class FakeStore extends ChannelStoreBase
  @property 'collectionName', {get: -> 'things'}
  @property 'model', {get: -> Thing}
  triggerItemsFetched: (items) ->
  triggerItemAdded: (item) ->
  triggerItemUpdated: (item) ->
  triggerItemDeleted: (item) ->
  triggerError: (errorMessage) ->

  constructor: ->
    super()

describe "util/channel-store-base", ->
  socket = null
  subject = null

  beforeEach ->
    socket = new Socket()
    subject = new FakeStore()
    # subject = alt.createStore(FakeStore, 'FakeStore');

  describe "join", ->
    it "throws an error without a socket", ->
      expect(->
        subject.join({token: 'some-token', subtopic: 'all'})
      ).to.throw(/missing socket/)

    it "throws an error without a subtopic", ->
      expect(->
        subject.join({socket: socket, token: 'some-token'})
      ).to.throw(/missing subtopic/)

# describe "connectChannelMixin()", ->
#   it "has an empty collection by default", ->
#     expect(subject.collection.isEmpty()).to.be.true

#   describe "setSocket()", ->
#     it "can set the socket to start listening to channel", ->
#       chanSpy = sinon.spy(socket, 'chan')
#       subject.setSocket(socket)
#       expect(chanSpy).to.have.been.calledWith('things:store', {})

#   describe "pushPayload()", ->
#     it "initializes the collection to empty if none present in payload", ->
#       subject.pushPayload({stuff: [{id: 1, name: "foo"}]})
#       expect(subject.collection.isEmpty()).to.be.true

#     it "initializes the collection if present in payload", ->
#       subject.pushPayload({stuff: [], things: [{id: 42, name: "allo"}, {id: 33, name: "la terre"}]})
#       expect(subject.collection.size).to.equal 2
#       expect(subject.collection.map((v) -> v.name).toArray()).to.have.members ["allo", "la terre"]

#     it "instantiates a model instance for each item of the collection", ->
#       subject.pushPayload({things: [{id: 42, name: "allo"}]})
#       expect(subject.collection.first().constructor).to.equal Thing

#     it "triggers a store change", ->
#       triggerStub = sinon.stub(subject, 'trigger')
#       subject.pushPayload({things: [{id: 42, name: "allo"}]})
#       expect(triggerStub).to.have.been.calledWithExactly(subject.collection)

# describe "add an item", ->
#   beforeEach -> subject.setSocket(socket)

#   it "inserts an item in the collection", ->
#     item = subject.addItem({name: "hello"})
#     expect(subject.collection.first()).to.equal item
#     expect(item.get('id')).to.not.be.empty
#     expect(item.get('name')).to.equal "hello"

#   it "triggers a store change", ->
#     triggerStub = sinon.stub(subject, 'trigger')
#     subject.addItem({name: "hello"})
#     expect(triggerStub).to.have.been.calledWithExactly(subject.collection)

#   it "inserts a pending operation", ->
#     item = subject.addItem({name: "hello"})
#     expect(subject.pending.size).to.equal 1
#     operation = subject.pending.first()
#     expect(operation.get('type')).to.equal 'add'
#     expect(operation.get('id')).to.equal item.get('id')

#   it "sends an add request through the channel", ->
#     pushSpy = sinon.spy(socket.channels['things:store'], 'push')
#     item = subject.addItem({name: "hello"})
#     matcher = sinon.match({ref: item.id, attributes: {name: "hello"}})
#     expect(pushSpy).to.have.been.calledWithExactly('add', matcher)

#   context "the add request succeeds", ->
#     it "replaces the item with the latest version", ->
#       item = subject.addItem({name: "hello"})
#       push = socket.channels['things:store'].pushes.add
#       push.RECEIVE('ok', {ref: item.id, thing: {id: 42, name: "hello"}})
#       expect(subject.collection.size).to.equal 1
#       existing = subject.collection.first()
#       expect(existing.id).to.equal 42
#       expect(existing.name).to.equal "hello"
#       expect(subject.pending.isEmpty()).to.be.true

#     it "triggers a store change", ->
#       item = subject.addItem({name: "hello"})
#       triggerStub = sinon.stub(subject, 'trigger')
#       push = socket.channels['things:store'].pushes.add
#       push.RECEIVE('ok', {ref: item.id, thing: {id: 42, name: "hello"}})
#       expect(triggerStub).to.have.been.calledWithExactly(subject.collection)

#   context "the add request fails", ->
#     it "removes the item from the collection", ->
#       item = subject.addItem({name: "hello"})
#       push = socket.channels['things:store'].pushes.add
#       push.RECEIVE('error', {ref: item.id, reason: "adding item failed"})
#       expect(subject.collection.isEmpty()).to.be.true
#       expect(subject.pending.isEmpty()).to.be.true

#     it "triggers a store change", ->
#       item = subject.addItem({name: "hello"})
#       triggerStub = sinon.stub(subject, 'trigger')
#       push = socket.channels['things:store'].pushes.add
#       push.RECEIVE('error', {ref: item.id, reason: "adding item failed"})
#       expect(triggerStub).to.have.been.calledWithExactly(subject.collection)

# describe "an item was added", ->
#   channel = null

#   beforeEach ->
#     subject.setSocket(socket)
#     channel = socket.channels['things:store']
#     channel.RECEIVE('ok')

#   it "adds the item to the collection", ->
#     channel.ON('added', {ref: 'whatever', thing: {id: 11, name: "eleven"}})
#     expect(subject.collection.size).to.equal 1
#     item = subject.collection.first()
#     expect(item.get('id')).to.equal 11
#     expect(item.get('name')).to.equal "eleven"

#   it "triggers a store change", ->
#     triggerStub = sinon.stub(subject, 'trigger')
#     channel.ON('added', {ref: 'whatever', thing: {id: 11, name: "eleven"}})
#     expect(triggerStub).to.have.been.calledWithExactly(subject.collection)

# describe "delete an item", ->
#   beforeEach ->
#     subject.setSocket(socket)
#     subject.pushPayload({things: [{id: 42, name: "delete me"}]})

#   it "deletes an item from the collection", ->
#     subject.delItem({id: 42})
#     expect(subject.collection.isEmpty()).to.be.true

#   it "triggers a store change", ->
#     triggerStub = sinon.stub(subject, 'trigger')
#     subject.delItem({id: 42})
#     expect(triggerStub).to.have.been.calledWithExactly(subject.collection)

#   it "inserts a pending operation", ->
#     subject.delItem({id: 42})
#     expect(subject.pending.size).to.equal 1
#     operation = subject.pending.first()
#     expect(operation.get('type')).to.equal 'del'
#     expect(operation.get('id')).to.equal 42

#   it "sends a del request through the channel", ->
#     pushSpy = sinon.spy(socket.channels['things:store'], 'push')
#     subject.delItem({id: 42})
#     matcher = sinon.match({attributes: {id: 42}})
#     expect(pushSpy).to.have.been.calledWithExactly('del', matcher)

#   context "the del request succeeds", ->
#     it "replaces the item with the latest version", ->
#       subject.delItem({id: 42})
#       push = socket.channels['things:store'].pushes.del
#       push.RECEIVE('ok', {ref: 'meh', thing: {id: 42}})
#       expect(subject.collection.isEmpty()).to.be.true
#       expect(subject.pending.isEmpty()).to.be.true

#     it "triggers a store change", ->
#       subject.delItem({id: 42})
#       triggerStub = sinon.stub(subject, 'trigger')
#       push = socket.channels['things:store'].pushes.del
#       push.RECEIVE('ok', {ref: 'meh', thing: {id: 42}})
#       expect(triggerStub).to.have.been.calledWithExactly(subject.collection)

#   context "the del request fails", ->
#     it "puts back the item in the collection", ->
#       subject.delItem({id: 42})
#       push = socket.channels['things:store'].pushes.del
#       push.RECEIVE('error', {reason: "deleting item failed"})
#       expect(subject.collection.size).to.equal 1
#       existing = subject.collection.first()
#       expect(existing.id).to.equal 42
#       expect(existing.name).to.equal "delete me"
#       expect(subject.pending.isEmpty()).to.be.true

#     it "triggers a store change", ->
#       subject.delItem({id: 42})
#       triggerStub = sinon.stub(subject, 'trigger')
#       push = socket.channels['things:store'].pushes.del
#       push.RECEIVE('error', {reason: "deleting item failed"})
#       expect(triggerStub).to.have.been.calledWithExactly(subject.collection)

# describe "an item was deleted", ->
#   channel = null
#   item    = null

#   beforeEach ->
#     subject.setSocket(socket)
#     channel = socket.channels['things:store']
#     channel.RECEIVE('ok')
#     subject.pushPayload({things: [{id: 42, name: "delete me"}]})

#   it "adds the item to the collection", ->
#     channel.ON('deleted', {ref: 'whatever', thing: {id: 42}})
#     expect(subject.collection.isEmpty()).to.be.true

#   it "triggers a store change", ->
#     triggerStub = sinon.stub(subject, 'trigger')
#     channel.ON('deleted', {ref: 'whatever', thing: {id: 42}})
#     expect(triggerStub).to.have.been.calledWithExactly(subject.collection)


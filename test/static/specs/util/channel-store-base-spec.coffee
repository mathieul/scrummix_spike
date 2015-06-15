ChannelStoreBase = require 'scrummix/util/channel-store-base'
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

  describe "#join", ->
    it "throws an error without a socket", ->
      expect(->
        subject.join({token: 'some-token', subtopic: 'all'})
      ).to.throw(/missing socket/)

    it "throws an error without a subtopic", ->
      expect(->
        subject.join({socket: socket, token: 'some-token'})
      ).to.throw(/missing subtopic/)

    it "starts listening to the channel with subtopic", ->
      chanSpy = sinon.spy(socket, 'chan')
      subject.join
        socket: socket
        token: 'some-token'
        subtopic: 'filter=42'
      expect(chanSpy).to.have.been.calledWith('things:filter=42', {token: 'some-token'})

  describe "#fetchItems", ->
    context "channel is not connected", ->
      it "throws an error if the channel is not connected", ->
        expect(-> subject.fetchItems()).to.throw(/must be connected/)

    context "channel is connected", ->
      channel = null

      beforeEach ->
        subject.join({socket: socket, subtopic: 'all'})
        channel = socket.channels['things:all']

      context "channel is joining", ->
        beforeEach -> channel.JOIN()

        it "bufferizes the fetch request until the channel is joined", ->
          pushSpy = sinon.spy(channel, 'push')
          subject.fetchItems()
          expect(pushSpy).to.not.have.been.called
          channel.RECEIVE('ok', {})
          expect(pushSpy).to.have.been.called

      context "channel is joined", ->
        pushSpy = null

        beforeEach ->
          channel.RECEIVE('ok', {})
          pushSpy = sinon.spy(channel, 'push')

        it "pushes a fetch request on the channel", ->
          subject.fetchItems()
          matcher = sinon.match({from: subject.ref})
          expect(pushSpy).to.have.been.calledWithExactly('fetch', matcher)

        it "calls #triggerItemsFetched with items when receiving successful response", ->
          spy = sinon.spy(subject, 'triggerItemsFetched')
          subject.fetchItems()
          push = channel.pushes.fetch
          push.RECEIVE('ok', {items: [{id: 42, name: "hello"}, {id: 99, name: "bye"}]})
          expect(spy).to.have.been.calledWithMatch((value) =>
            expect(value.size).to.equal 2
            expect(value.get(42).name).to.equal "hello"
            expect(value.get(99).name).to.equal "bye"
            true
          )

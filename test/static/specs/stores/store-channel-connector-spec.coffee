Publisher = require 'test/support/publisher-helper'
Connector = require 'scrummix/stores/store-channel-connector'
{Socket} = require 'phoenix'

describe "stores/store-channel-connector", ->
  socket = null
  channel = null
  chanStub = null

  beforeEach ->
    socket = sinon.createStubInstance(Socket)
    chanStub = sinon.stub(socket, 'chan').returns(channel = new Publisher)

  describe "connectChannelMixin()", ->
    it "can set the socket to start listening to channel", ->
      subject = Object.assign((->), Connector.connectChannelMixin('things'))
      subject.setSocket(socket)
      expect(chanStub).to.have.been.calledWith('things:store', {})

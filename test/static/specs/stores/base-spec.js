import Base from 'scrummix/stores/base';

describe("stores/base", function () {
  describe(".createStore", function () {
    it("creates a Reflux store", function () {
      let store = Base.createStore({});
      expect(typeof store.listen).to.be.equal('function');
    });
  });
});

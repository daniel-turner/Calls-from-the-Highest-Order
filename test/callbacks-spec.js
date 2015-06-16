var chai = require('chai');
chai.should();

var callbacks = require('../lib/callbacks');

describe('Callbacks', function() {

  describe('wait', function() {

    it('should wait `n` seconds to invoke the callback function', function(done) {
      this.timeout(2000);
      var start = Date.now();
      callbacks.wait(1, function () {
        var time = Date.now() - start;
        time.should.be.within(999,2000);
        done();
      })
    });
  });

  describe('repeat', function() {

    var count = 0;
    beforeEach(function(done){
      this.timeout(1000);
      callbacks.repeat(5, function () {
        count++;
        if(count === 4) done();
      });
    });

    it('should invoke the `callback` function `n` times', function() {
      count.should.be.equal(4);
    });
  });

  describe('User', function() {

    it('should find by id', function(done) {
      callbacks.User.find({ id : 2 }, function(err, users){
        chai.expect(err).to.be.null;
        users.should.have.length.of(1);
        users[0].name.should.equal('goldstine');
        done();
      });
    });
    it('should return a RangeError when query has fields that User does not have', function(done) {
      callbacks.User.find({ happy : true, iKnowIt : true }, function(err, users){
        err.should.not.be.null;
        err.constructor.name.should.be.equal('RangeError');
        users.should.have.length.of(0);
        done();
      });
    });
    it('should find by multiple parameters', function(done) {
      callbacks.User.find({ id : 4, name : 'davinci' }, function(err, users){
        chai.expect(err).to.be.null;
        users.should.have.length.of(1);
        users[0].mood.should.equal('elated');
        done();
      });
    });
    it('should return all users that match the query', function(done) {
      callbacks.User.find({ mood : "elated" }, function(err, users){
        chai.expect(err).to.be.null;
        users.should.have.length.of(3);
        users[0].name.should.equal('curie');
        users[1].name.should.equal('davinci');
        users[2].name.should.equal('mccarthy');
        done();
      });
    });
    it('should return a TypeError when a query value and the schema value have mismatched types', function(done) {
      callbacks.User.find({ id : "two" }, function(err, users){
        err.should.not.be.null;
        err.constructor.name.should.be.equal('TypeError');
        users.should.have.length.of(0);
        done();
      });
    });
  });

});
var assert = require("assert"); // core module
var C = require('../cash.js');  // our module

describe('Cash Register', function(){
  describe('Module C', function(){
    it('should have a getChange Method', function(){
      assert.equal(typeof C, 'object');
      assert.equal(typeof C.getChange, 'function');
    })

    it('getChange(210,300) should equal [50,20,20]', function(){
        var change = C.getChange(210,300)
        assert.deepEqual(change, [50, 20, 20]);
    })

  })
})  


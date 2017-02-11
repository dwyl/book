// Wondering what this is? see: https://github.com/dwyl/learn-tape

var test = require('tape'); // assign the tape library to the variable "test"
var hello = require('../lib/hello.js');

test('hello("World") should return Hello World!', function (t) {
  var actual = hello('World');
  var expected = 'Hello World!'
  t.equal(expected, actual, 'Got: ' + actual + ' (as expected)');
  t.end();
});

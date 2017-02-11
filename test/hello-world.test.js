// Wondering what this is? see: https://github.com/dwyl/learn-tape

var test = require('tape'); // assign the tape library to the variable "test"

test('Hello World!', function (t) {
  var actual = 'Hello World!'
  t.equal(actual.indexOf('Hello'), 0);
  t.end();
});

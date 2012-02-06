/**
 * A true random shuffle
 */
var http = require('http');
var url = require('url');
var client = http.createClient(80, 'www.random.org');

exports.shuffle = function(array, callback) {
  var request = client.request('GET', '/sequences/?min=0&max=' + (array.length - 1) + '&col=1&format=plain&rnd=new');
  request.end();
  request.on('response', function(response) {
    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      var randomIndices = chunk.trim().split('\n');
      var shuffled = [];
      randomIndices.forEach(function(index) {
        shuffled.push(array[index]);
      });
      callback(shuffled);
    });
  });
};

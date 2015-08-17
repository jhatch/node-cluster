// dependencies
// ----------------------------------------------------------------------------

var express = require('express');
var config  = require('config');

// the web application itself
// ----------------------------------------------------------------------------

var app = express();

app.get('/test', function (req, res) {
  pLog('request recieved', req.method, req.path);
  return res.send('cluster fudge');
});

app.run = function () {
  app.listen(config.server.port, null, null, function () {
    pLog('server running on port', config.server.port);
  });
};

// some utiltiies and stuffs
// ----------------------------------------------------------------------------

// as we are trying to demonstrate cross process communication
// make a simple utility logger showing PID
function pLog() {
  var args =  Array.prototype.slice.call(arguments);
  args.unshift('[PID=' + process.pid + ']');
  console.log.apply(console, args);
}

// public exports
// ----------------------------------------------------------------------------

module.exports = {
  run: app.run
};
var express = require('express');
var config  = require('config');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

// as we are trying to demonstrate cross process communication
// make a simple utility logger showing PID
function pLog() {
  var args =  Array.prototype.slice.call(arguments);
  args.unshift('[PID=' + process.pid + ']');
  console.log.apply(console, args);
}

// now define our web application itself
var app = express();

app.get('/test', function (req, res) {
  pLog('handling a request');
  return res.send('cluster fudge');
});

// but before we listen...fork the process so that incoming connections
// are balanced (round-robin) over each available CPU core.
if (cluster.isMaster) {

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    pLog('worker ' + worker.process.pid + ' died');
  });

} else {

  // workers share the master socket
  app.listen(config.server.port, null, null, function () {
    pLog('server running on port', config.server.port);
  });

}

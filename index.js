var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var server  = require('./lib/server');

// but before we listen...fork the process so that incoming connections
// are balanced (round-robin) over each available CPU core.
if (cluster.isMaster) {

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.error('worker ' + worker.process.pid + ' died!');

    // TODO: handle the error...

  });

} else {
  server.run(); // workers share the master socket
}

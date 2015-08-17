let cluster = require('cluster');
let numCPUs = require('os').cpus().length;
let server  = require('./lib/server');

// but before we listen...fork the process so that incoming connections
// are balanced (round-robin) over each available CPU core.
if (cluster.isMaster) {

  cluster.on('online', worker => {
    console.log('worker %s came online', worker.process.pid);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.error('worker %s died by %s', worker.process.pid, signal || code);
    cluster.fork(); // start up a new one
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

} else {
  server.run(); // workers share the master socket
}

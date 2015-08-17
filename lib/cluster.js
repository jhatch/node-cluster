let cluster = require('cluster');
let os      = require('os');

module.exports = {
  start: startFunc => {
    // # worker
    if (cluster.isWorker) {
      return startFunc(); // workers share the master socket
    }

    // # master
    // fork the process so that incoming connections
    // are balanced (round-robin) over each available CPU core.
    cluster.on('online', worker => console.log('worker %s came online', worker.process.pid));

    cluster.on('exit', (worker, code, signal) => {
      // check if we killed this worker on purpose
      if (signal === 'SIGUSR2') {
        console.error('worker %s taken offline by %s', worker.process.pid, signal || code);
        return;
      }

      // otherwise assume it crashed and start up a replacement
      console.error('worker %s crashed unexpectedly by %s', worker.process.pid, signal || code);
      cluster.fork();
    });

    // support hot reloading
    process.on('SIGUSR2', () => {
      console.log('HOT RELOAD INITIATED');

      // for each worker, spin up a new worker and then kill
      // the old one once the new worker is up and listening
      var pids = Object.keys(cluster.workers);

      pids.forEach(pid => {
        // spin up the replacement
        let worker = cluster.fork();

        // assign it to a currently running worker
        worker.predecessor = pid;

        // when the new worker is ready and listening, kill its predecessor
        worker.on('listening', () => cluster.workers[this.predecessor].kill('SIGUSR2'));
      })
    });

    // initial batch of workers
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }

    console.log('master up and running', process.pid);
  }
};

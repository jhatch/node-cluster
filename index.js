let cluster = require('./lib/cluster');
let server  = require('./lib/server');

cluster.start(() => {
  server.run();
});
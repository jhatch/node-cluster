let express = require('express');
let config  = require('config');
let pLog    = require('./pLog.js');

// the web application itself
let app = express();

app.get('/test', (req, res) => {
  pLog('request recieved', req.method, req.path);
  return res.send('cluster fudge');
});

app.run = () => {
  app.listen(config.server.port, null, null, () => {
    pLog('server running on port', config.server.port);
  });
};

module.exports = {
  run: app.run
};

// @flow

import app from './app';
import debug from 'debug';
import http from 'http';
import {normalizePort} from './helpers/network'

const debugServer = debug('interview:server');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
server.listen(port);

server.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      debugServer(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debugServer(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debugServer('Listening on ' + bind);
});

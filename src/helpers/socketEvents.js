'use-strict';
require('magic-globals');

//  Get the logger instance
const logger = require('./logger');
const FILE = __file;

module.exports.onConnection = function(io) {
  const FUNC = 'onConnection';
  io.on('connection', function(socket) {
    socket.on('test', function(data) {
      console.log(data);
    });
    logger.info(`[${FILE}] , [${FUNC}] , socket client connected`);
    logger.info(`[${FILE}] , [${FUNC}] , client id = ${socket.id}`);
  });
};

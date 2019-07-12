'use-strict';
require('magic-globals');
const logger = require('../../config/logger');

const sockEvents = {};

sockEvents.onConnection = function(io) {
  io.on('connection', function(socket) {
    logger.info('[%s] , [onConnection] , socket client connected', __file);
    logger.info('[%s] , [onConnection] , client id = %s', __file, socket.id);
  });
};

module.exports = sockEvents;

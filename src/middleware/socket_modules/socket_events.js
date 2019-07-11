'use-strict';
require('magic-globals');
const logger = require('../../config/logger');

var sock_events = {};

sock_events.onConnection = function(io){
    io.on('connection',function(socket){
        logger.info('[%s] , [onConnection] , socket.io client connected',__file);
        logger.info('[%s] , [onConnection] , socket client id = %s',__file,socket.id);
    });
}

module.exports = sock_events;
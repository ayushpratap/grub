'use-stric';

require('magic-globals');
const gConfig = require('../../config/config');
const logger = require('../../config/logger');
const check = require('check-types');
const socketEvents = require('../socket_modules/socketEvents');
const EXIT = 'Exit the application :';

module.exports.checkSessionSecret = function() {
  const func = 'checkSessionSecret';
  const secret = gConfig.sessionSecret;
  //  Check if session secret is set
  if (
    check.emptyString(secret) ||
    check.null(secret) ||
    check.undefined(secret)
  ) {
    logger.error('[%s] , [%s] , Session secret is not set', __file, func);
    logger.info('[%s] , [%s] , Exit the application', __file, func);
    process.exit(1);
  } else {
    logger.debug('[%s] , [%s] , Session secret is = %s', __file, func, secret);
    return true;
  }
};

module.exports.checkDbUrl = function() {
  const func = 'checkDbUrl';
  const dbUrl = gConfig.dbUrl;
  //  Check if url for connecting to database is present in configuration or not
  if (
    check.emptyString(dbUrl) ||
    check.null(dbUrl) ||
    check.undefined(dbUrl)
  ) {
    logger.error('[%s] , [%s] , %s dbUrl is not set', __file, func, EXIT);
    process.exit(1);
  } else {
    logger.debug('[%s] , [checkDbUrl] , DB url is = %s', __file, dbUrl);
    return true;
  }
};

module.exports.startServer = function(http, io) {
  //  Start HTTP server
  const port = gConfig.port;
  const func = 'startServer';
  http.listen(port, function(err) {
    if (err) {
      throw err;
    } else {
      const url = `http://localhost:${port}`;
      logger.info('[%s] , [%s] , HTTP server is at %s', __file, func, url);
    }
  });

  //  Start socket.io server
  socketEvents.onConnection(io);
};

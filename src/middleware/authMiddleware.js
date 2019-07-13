'use-strict';
require('magic-globals');
const check = require('check-types');
const logger = require('../config/logger');
const FILE = __file;

module.exports.checkSession = function(req, res, next) {
  const FUNC = 'checkSession';
  logger.debug(`[${FILE}] , [${FUNC}] , Request received`);
  if (check.null(req.session.userId)||
  check.undefined(req.session.userId)||
  check.emptyString(req.session.userId)) {
    //  User session is not set
    logger.info(`[${FILE}] , [${FUNC}] , Session is not set`);
    logger.info(`[${FILE}] , [${FUNC}] , Redirect to '/'`);
    res.redirect('/');
  } else {
    //  User session is set
    logger.info(`[${FILE}] , [${FUNC}] , Session is set`);
    return next();
  }
};

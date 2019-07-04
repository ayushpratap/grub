'use-strict';
require('magic-globals');
const check = require('check-types');
const logger = require('../helpers/logger');
const FILE = __file;

const isSessionSet = function(req) {
  if (check.null(req.session.userId)||
  check.emptyString(req.session.userId)||
  check.undefined(req.session.userId)) {
    //  Session is not set , return false
    return false;
  } else {
    //  Session is set , return true
    return true;
  }
};

module.exports.checkSession = function(req, res, next) {
  const FUNC = 'checkSession';
  logger.debug(`[${FILE}] , [${FUNC}] , Request path = ${req.path}`);
  logger.debug(`[${FILE}] , [${FUNC}] , Request method = ${req.method}`);
  const sessionSet = isSessionSet(req);
  switch (req.path) {
    case '/':
      logger.info(`[${FILE}] , [${FUNC}] , case '/'`);

      //  Check if session is set
      logger.info(`[${FILE}] , [${FUNC}] , sessionSet = ${sessionSet}`);
      if (sessionSet) {
        logger.info(`[${FILE}] , [${FUNC}] , Session is set`);
        //  Session is set , redirect to main page
        res.redirect('/api/main');
      } else {
        logger.info(`[${FILE}] , [${FUNC}] , Session is not set`);
        //  Session is not set , let it go to GET / router
        next();
      }
      break;
    case '/login':
      logger.info(`[${FILE}] , [${FUNC}] , case /login`);
      //  Check the request type
      switch (req.method) {
        case 'GET':
          logger.info(`[${FILE}] , [${FUNC}] , method GET`);
          //  Check if session is set
          logger.info(`[${FILE}] , [${FUNC}] , sessionSet = ${sessionSet}`);
          if (sessionSet) {
            logger.info(`[${FILE}] , [${FUNC}] , Session is set`);
            //  Session is set , redirect to main page
            res.redirect('/api/main');
          } else {
            logger.info(`[${FILE}] , [${FUNC}] , Session is not set`);
            //  Session is not set, let it go to GET /login route
            next();
          }
          break;
        default:
          logger.info(`[${FILE}] , [${FUNC}] , method POST`);
          //  Check if session is set
          logger.info(`[${FILE}] , [${FUNC}] , sessionSet = ${sessionSet}`);
          if (sessionSet) {
            logger.info(`[${FILE}] , [${FUNC}] , Session is not set`);
            logger.info(`[${FILE}] , [${FUNC}] , Request is not allowed`);
            //  Request is not allowed
            res
                .status(405)
                .send('This request is not allowed');
          } else {
            //  Process the request
            logger.info(`[${FILE}] , [${FUNC}] , Session is set`);
            logger.info(`[${FILE}] , [${FUNC}] , Process the request`);
            next();
          }
          break;
      }
      break;
    case '/register':
      //  Check the request type
      switch (req.method) {
        case 'GET':
          //  Check if session is set
          if (isSessionSet(req)) {
            //  Session is set , redirect to main page
            res.redirect('/api/main');
          } else {
            //  Session is not set , let it go to GET /register route
            next();
          }
          break;
        default:
          //  Check if session is set
          if (isSessionSet(req)) {
            //  Request not allowed
            res.status(405).send('This request is not allowed');
          } else {
            //  Process the request
            next();
          }
          break;
      }
      break;
    default:
      //  Check if session ise set
      if (isSessionSet(req)) {
        next();
      } else {
        //  Request is not allowed
        res
            .status(405)
            .send('This request is not allowed');
      }
      break;
  }
};

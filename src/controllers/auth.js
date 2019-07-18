'use-strict';

//  Require the npm components
require('magic-globals');
const check = require('check-types');
const bcryptjs = require('bcryptjs');

//  Require application components
const logger = require('../helpers/logger');
const User = require('../models/User');

const FILE = __file;

/**
 * This function renders the login page
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getLogin = function(req, res) {
  const FUNC = 'getLogin';
  logger.info(`[${FILE}] , [${FUNC}] , Process login request`);
  res.status(200).render('login', {title: 'Login Page'});
};

/**
 * This function process the login request
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.postLogin = function(req, res) {
  const FUNC = 'postLogin';
  logger.info(`[${FILE}] , [${FUNC}] , Process login request`);
  User.findOne({username: req.body.username})
      .exec(function(err, user) {
        if (err) {
          throw err;
        } else if (check.undefined(user)||
        check.emptyObject(user)||
        check.null(user)) {
          logger.debug(`[${FILE}] , [${FUNC}] , User do not exists`);
          const msg = 'User do not exists <hr> <a href="/">Home</a>';
          res.status(401).send(msg);
        } else {
          logger.debug(`[${FILE}] , [${FUNC}] , User exists`);
          const password = req.body.password;
          logger.debug(`[${FILE}] , [${FUNC}] , Checking password`);
          bcryptjs.compare(password, user.password, function(err, result) {
            if (true == result) {
              logger.debug(`[${FILE}] , [${FUNC}] , Password matched`);
              logger.debug(`[${FILE}] , [${FUNC}] , Setting session`);

              //  Set session
              req.session.userId = user._id;
              req.session.username = user.username;

              //  Set cookies
              res.cookie(`userId`, user._id);
              res.cookie(`username`, user.username);
              logger.debug(`[${FILE}] , [${FUNC}] , Redirecting to /main`);
              res.redirect('/api/main');
            } else {
              logger.debug(`[${FILE}] , [${FUNC}] , Password do not match`);
              res.send('Password incorrect <a href="/">Home</a>');
            }
          });
        }
      });
};
/**
 * This function process the register request
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.postRegister = function(req, res) {
  const FUNC = 'postRegister';
  //  Check if password and cPassword match or not
  if (req.body.password !== req.body.cPassword) {
    res.send('Password do not match');
  } else {
    //  Add user details to database
    const userData = {};
    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.username = req.body.username;
    userData.password = req.body.password;
    User.create(userData, function(err, user) {
      if (err) {
        throw err;
      }
      //  Set user details in the session
      req.session.userId = user._id;
      req.session.username = user.username;

      // Set cookies
      res.cookie(`userId`, user._id);
      res.cookie(`username`, user.username);
      logger.info('[%s] , [%s] , Session set', FILE, FUNC);
      //  Redirect to the main page
      res.redirect('/api/main');
    });
  }
};
/**
 * This function render the register page
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getRegister = function(req, res) {
  const FUNC = 'getRegister';
  logger.info('[%s] , [%s] , Session is not set', FILE, FUNC);
  logger.info('[%s] , [%s] , Render registration page', FILE, FUNC);
  res.status(200).render('register', {title: 'Register Page'});
};
/**
 * This functions handles the logout
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.logout = function(req, res) {
  const FUNC = 'logout';
  req.session.destroy(function(err) {
    if (err) {
      logger.error('[%s] , [%s] , [%o]', FILE, FUNC, err);
    } else {
      res.clearCookie(`userId`);
      res.clearCookie(`username`);
      logger.info('[%s] , [%s] , Session destroyed', FILE, FUNC);
      logger.info('[%s] , [%s] , Redirect to homepage', FILE, FUNC);
      res.redirect('/');
    }
  });
};

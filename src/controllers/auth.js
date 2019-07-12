'use-strict';
require('magic-globals');
const check = require('check-types');
const logger = require('../config/logger');
const User = require('../models/User');
const FILE = __file;

/**
 *@name index
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.index = function(req, res) {
  const FUNC = 'index';
  //  Check if session is set
  if (check.emptyString(req.session.userId)||
  check.null(req.session.userId)||
  check.undefined(req.session.userId)) {
    logger.info('[%s] , [%s] , Session is not set', FILE, FUNC);
    logger.info('[%s] , [%s] , Render the home page', FILE, FUNC);
    res
        .status(200)
        .render('homepage', {name: 'Ayush', title: 'homepage'});
  } else {
    console.log(check.undefined(req.session.userId));
    console.log(check.null(req.session.userId));
    console.log(check.emptyString(req.session.userId));
    logger.info('[%s] , [%s] , Session is set', FILE, FUNC);
    logger.info('[%s] , [%s] , Redirect to the main page', FILE, FUNC);
    res
        .status(200)
        .redirect('/main');
  }
};

module.exports.getLogin = function(req, res) {
  const FUNC = 'getLogin';
  if (check.emptyString(req.session.userId)||
  check.null(req.session.userId)||
  check.undefined(req.session.userId)) {
    logger.info('[%s] , [%s] , Session is not set', FILE, FUNC);
    logger.info('[%s] , [%s[ , Render login page', FILE, FUNC);
    res
        .status(200)
        .render('login', {title: 'Login Page'});
  } else {
    logger.info('[%s] , [%s] , Session is set', FILE, FUNC);
    logger.info('[%s] , [%s] , Redirect to main page', FILE, FUNC);
    res
        .status(200)
        .redirect('/main');
  }
};
module.exports.postLogin = function(req, res) {};
module.exports.postRegister = function(req, res) {};
module.exports.getRegister = function(req, res) {};

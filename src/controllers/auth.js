/* eslint-disable indent */
'use-strict';
require('magic-globals');
const check = require('check-types');
const logger = require('../config/logger');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const FILE = __file;

/**
 * @name index
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.index = function(req, res) {
  const FUNC = 'index';
  logger.info('[%s] , [%s] , Session is set', FILE, FUNC);
  logger.info('[%s] , [%s] , Redirect to the main page', FILE, FUNC);
  res
      .status(200)
      .redirect('/main');
};

/**
 * @name getLogin
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.getLogin = function(req, res) {
  const FUNC = 'getLogin';
  if (check.emptyString(req.session.userId)||
  check.null(req.session.userId)||
  check.undefined(req.session.userId)) {
    logger.info('[%s] , [%s] , Session is not set', FILE, FUNC);
    logger.info('[%s] , [%s] , Render login page', FILE, FUNC);
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
/**
 * @name postLogin
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.postLogin = function(req, res) {
  const FUNC = 'postLogin';
  console.log(req.body.password);

  //  Check the state of session
  if (check.emptyString(req.session.userId)||
  check.null(req.session.userId)||
  check.undefined(req.session.userId)) {
    logger.info('[%s] , [%s] , Session is not set', FILE, FUNC);
    //  Session is not set
    // Check if Username and Password are set
    if (req.body.username && req.body.password) {
      //  Username and password are filled
      //  Authenticate the details
      //  Encrypt the user given password before comparison
      logger.info('[%s] , [%s] , Username and password are filled', FILE, FUNC);
      User.findOne({username: req.body.username})
          .exec(function(err, user) {
            if (err) {
              throw err;
            } else if (check.undefined(user)||
            check.emptyObject(user)||
            check.null(user)) {
              const msg = 'User do not exists <hr> <a href="/">Home</a>';
              res
                  .status(401)
                  .send(msg);
            } else {
              const password = req.body.password;
              bcryptjs.compare(password, user.password, function(err, result) {
                if (true == result) {
                  req.session.userId = user._id;
                  req.session.username = user.username;
                  res.redirect('/main');
                } else {
                  res.send('Password incorrect <a href="/">Home</a>');
                }
              });
            }
          });
    } else {
      //  Session is already set
      logger.info('[%s] , [%s] session set now redirect to /main', FILE, FUNC);
      res
          .status(200)
          .redirect('/main');
    }
  }
};

module.exports.postRegister = function(req, res) {
  const FUNC = 'postRegister';
  //  Check if session is set or not
  if (check.undefined(req.session.userId)||
  check.null(req.session.userId)||
  check.emptyString(req.session.userId)) {
    //  Session is not set
    //  Check if all the fields are filled
    if (req.body.email&&
      req.body.username&&
      req.body.password&&
      req.body.cPassword) {
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
            logger.info('[%s] , [%s] , Session set', FILE, FUNC);
            //  Redirect to the main page
            res.redirect('/main');
          });
        }
      }
  } else {
    //  Session is already set
    res.redirect('/main');
  }
};

module.exports.getRegister = function(req, res) {
  const FUNC = 'getRegister';
  //  Check if session is set
  if (check.undefined(req.session.userId)||
  check.null(req.session.userId)||
  check.emptyString(req.session.userId)) {
    //  Session is not set
    logger.info('[%s] , [%s] , Session is not set', FILE, FUNC);
    logger.info('[%s] , [%s] , Render registration page', FILE, FUNC);
    res
        .status(200)
        .render('register', {title: 'Register Page'});
  } else {
    //  Session is set
    logger.info('[%s] , [%s] , Session is set', FILE, FUNC);
    logger.info('[%s] , [%s] , Redirect to main page', FILE, FUNC);
    res
        .status(200)
        .redirect('/main');
  }
};

module.exports.logout = function(req, res) {
  const FUNC = 'logout';
  req.session.destroy(function(err) {
    if (err) {
      logger.error('[%s] , [%s] , [%o]', FILE, FUNC, err);
    } else {
      logger.info('[%s] , [%s] , Session destroyed', FILE, FUNC);
      logger.info('[%s] , [%s] , Redirect to homepage', FILE, FUNC);
      res.redirect('/');
    }
  });
};


'use-strict';
//  TODO : Add socket.io client in main page
require('magic-globals');
const express = require('express');
const isUndefined = require('is-undefined');
const isEmpty = require('is-empty');
const bcryptjs = require('bcryptjs');
const logger = require('../config/logger');
const User = require('../models/User');
// eslint-disable-next-line new-cap
const router = express.Router();
const dashLine = '------------------------------------------------------------';
const file = __file;
/**
 * This route loads the homepage of the application
 * If the user is alread logged in then user will be
 * redirected to the main page.
 */
router.get('/', (req, res) => {
  logger.info(dashLine);
  logger.info('[%s] , GET /', file);

  /**
     * Check if req.session.username is set or not.
     * If it is empty of undefined then that means
     * session is not set.
     * If session is not set then render the homepage.
     * If session is set then redirect the user to the
     * main page.
     */
  if (isUndefined(req.session.username) || isEmpty(req.session.username)) {
    logger.info('[%s] , session is not set', file);
    logger.info('[%s] , render the home page', file);
    res
        .status(200)
        .render('homepage', {
          name: 'Ayush',
          title: 'homepage',
        });
  } else {
    logger.info('[%s] , session is set to = [%s]', file, req.session.username);
    logger.info('[%s] , redirect the use to main page', file);
    res
        .status(200)
        .redirect('/main');
  }
});

/**
 * This route loads the main page of the application.
 * If the user is logged in then render the main page
 * else redirect the user to the homepage.
 */
router.get('/main', function(req, res) {
  logger.info(dashLine);
  logger.info('[%s] , GET /main', file);

  /**
     * Check if req.session.username is set or not.
     * If it is undefined or empty then that means
     * session is not set otherwise it means session
     * is set and user is logged in.
     * So if session is set then render the main page
     * else redirect the user to the login page.
     */
  if (isUndefined(req.session.userId) || isEmpty(req.session.userId)) {
    logger.info('[%s] , session is not set ', file);
    logger.info('[%s] , redirect the user to login page', file);
    res
        .status(200)
        .redirect('/login');
  } else {
    logger.info('[%s] , session is set = [%s]', file, req.session.username);
    logger.info('[%s] , render the main page', file);

    //  Retrive all useres from db
    User.find({}, function(err, users) {
      if (err) {
        throw err;
      }
      const userList = {};
      users.forEach(function(user) {
        userList[user._id] = user;
      });
      res
          .status(200)
          .render('main', {
            title: 'Main Page',
            username: req.session.username,
            userId: req.session.userId,
            userList: userList,
          });
    });
  }
});

/**
 * This route loads the registration page of the application
 */
router.get('/register', (req, res) => {
  logger.info(dashLine);
  logger.info('[%s] , GET /register', file);
  if (isUndefined(req.session.userId) || isEmpty(req.session.userId)) {
    //  Session is not set
    logger.info('[%s] , session is not set, render registration page', file);
    res
        .status(200)
        .render('register', {
          title: 'Register Page',
        });
  } else {
    //  Session is set
    logger.info('[%s] , session is set , redirct to main page');
    res.redirect('/main');
  }
});

router.post('/register', (req, res, next) => {
  logger.info(dashLine);
  logger.info('[%s] , POST /register', file);

  //  Check if session is already set
  if (isUndefined(req.session.userId) || isEmpty(req.session.userId)) {
    //  Session is not set
    //  Check if all the fileds filled or not
    if (
      req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.cPassword
    ) {
      // Confirm if the password and confirm password are same or not
      if (req.body.password !== req.body.cPassword) {
        const err = new Error('Password do not match');
        err.status = 400;
        res.send('Password do not match');
        return next(err);
      }
      //  Create a user data object
      const userData = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      };
      User.create(userData, (error, user) => {
        if (error) {
          return next(error);
        } else {
          //  Set the user id as current session id
          req.session.userId = user._id;
          req.session.username = req.body.username;

          // Redirect to the main page
          return res.redirect('/main');
        }
      });
    }
  } else {
    //  Session is already set
    res.redirect('/main');
  }
});

/**
 * This route loads the login page of the application.
 */
router.get('/login', (req, res) => {
  logger.info(dashLine);
  logger.info('[%s] , GET /login', file);

  /**
     * Check if req.session.username is set or not.
     * If it is set then it means user is logged in.
     * If session is set then redirect the user to
     * main page.
     * Else render the login page.
     */
  if (isUndefined(req.session.userId) || isEmpty(req.session.userId)) {
    logger.info('[%s] , session is not set, render login page', file);
    res
        .status(200)
        .render('login', {
          title: 'Login Page',
        });
  } else {
    logger.info('[%s] , session is set , redirect to MainPage', file);
    res
        .status(200)
        .redirect('/main');
  }
});
router.get('/logout', (req, res) => {
  logger.info(dashLine);
  logger.info('[%s] , GET /logout', file);
  req.session.destroy((err) => {
    if (err) {
      logger.error('[%s] , %o', file, err);
    }
    logger.info('[%s] , session destroyed and redirect to homepage', file);
    res.redirect('/');
  });
});
router.post('/login', (req, res, next) => {
  /**
     * Existing user trying to login
     */
  logger.info(dashLine);
  logger.info('[%s] , POST /login', file);
  logger.info('[%s] , Request received to login', file);
  logger.info('[%s] , %o', file, req.body);

  //  Check if seesion is already established
  if (isUndefined(req.session.userId) || isEmpty(req.session.userId)) {
    //  Session is not set
    logger.info('[%s] , session is not set, set the session', file);

    //  Check if userame and password are filled
    if (req.body.username && req.body.password) {
      logger.info('[%s] , Username and password are filled', file);
      //  Authenticate the user
      User.findOne({username: req.body.username})
          .exec(function(err, user) {
            if (err) {
              throw err;
            } else if (isUndefined(user) || isEmpty(user) || null == user) {
              res
                  .status(401)
                  .send('User do not exists hr <a href="/">Home</a>');
            } else {
              const password = req.body.password;
              bcryptjs.compare(password, user.password, function(err, result) {
                if (true == result) {
                  req.session.userId = user._id;
                  req.session.username = user.username;
                  res.redirect('/main');
                } else {
                  res.send('Password is not correct  <a href="/">Home</a>');
                }
              });
            }
          });
    }
  } else {
    //  Session is set
    logger.info('[%s] , session is set , redirect to main page', file);
    res
        .status(200)
        .redirect('/main');
  }
});

router.get('/getUserList', function(req, res) {
  logger.info(dashLine);
  logger.info('[%s] , GET /getUserList', file);
  res.send({name1: 'Singh', name2: 'Pratap', name3: 'Ayush'});
});
module.exports = router;

'use-strict';
//  TODO : Add socket.io client in main page
require('magic-globals');
const express = require('express');
const logger = require('../config/logger');
const auth = require('../controllers/auth');
// eslint-disable-next-line new-cap
const router = express.Router();
const dashLine = '------------------------------------------------------------';
const file = __file;
/**
 * This route loads the homepage of the application
 * If the user is already logged in then user will be
 * redirected to the main page.
 */
router.get('/', (req, res) => {
  logger.info(dashLine);
  auth.index(req, res);
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
  //  if (isUndefined(req.session.userId) || isEmpty(req.session.userId)) {
  //    logger.info('[%s] , session is not set ', file);
  //    logger.info('[%s] , redirect the user to login page', file);
  //    res
  //        .status(200)
  //        .redirect('/login');
  //  } else {
  logger.info('[%s] , session is set = [%s]', file, req.session.username);
  logger.info('[%s] , render the main page', file);
  res.status(200).render('main', {
    title: 'Main Page',
    username: req.session.username, userId: req.session.userId,
  });
});

/**
 * This route loads the registration page of the application
 */
router.get('/register', (req, res) => {
  logger.info(dashLine);
  logger.info('[%s] , GET /register', file);
  auth.getRegister(req, res);
});

router.post('/register', (req, res) => {
  logger.info(dashLine);
  logger.info('[%s] , POST /register', file);
  auth.postRegister(req, res);
});

/**
 * This route loads the login page of the application.
 */
router.get('/login', (req, res) => {
  logger.info(dashLine);
  auth.getLogin(req, res);
});

router.get('/logout', (req, res) => {
  logger.info(dashLine);
  auth.logout(req, res);
});
router.post('/login', (req, res) => {
  /**
     * Existing user trying to login
     */
  logger.info(dashLine);
  auth.postLogin(req, res);
});

router.get('/getUserList', function(req, res) {
  logger.info(dashLine);
  logger.info('[%s] , GET /getUserList', file);
  const userList = {list: ['Ayush', 'Pratap', 'Singh']};
  res.send(userList);
});
module.exports = router;

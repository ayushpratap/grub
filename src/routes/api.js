'use-strict';

//  Get the app controller
// eslint-disable-next-line new-cap
const router = require('express').Router();
const app = require('../controllers/app');
const database = require('../controllers/database');
//  Setup the route for /main request path
router.get('/api/main', app.main);

//  Setup the route to fetch all user list
router.get('/api/getUserList', database.getUserList);
module.exports = router;


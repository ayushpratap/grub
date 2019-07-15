'use-strict';

//  Get the express router object
// eslint-disable-next-line new-cap
const router = require('express').Router();

//  Get the app controller
const app = require('../controllers/app');

//  Get the database controller
const database = require('../controllers/database');

//  Setup the route for /main request path
router.get('/api/main', app.main);

//  Setup the route to fetch all user list
router.get('/api/getUserList', database.getUserList);

//  Export the router
module.exports = router;


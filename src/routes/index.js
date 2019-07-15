'use-strict';

//  Gte the express router object
// eslint-disable-next-line new-cap
const router = require('express').Router();

//  Get the index controller
const index = require('../controllers/index');

//  Setup the index route
router.get('/', index);

//  Export the router
module.exports = router;

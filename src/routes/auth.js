'use-strict';
require('magic-globals');

//  Get the express router object
// eslint-disable-next-line new-cap
const router = require('express').Router();

//  Get the auth controller
const auth = require('../controllers/auth');

//  Setup route to render login page
router.get('/login', auth.getLogin);

//  Setup route to render register page
router.get('/register', auth.getRegister);

//  Setup router for logout
router.get('/logout', auth.logout);

//  Setup route to handle login request
router.post('/login', auth.postLogin);

//  Setup route to handle register request
router.post('/register', auth.postRegister);

//  Export the router
module.exports = router;


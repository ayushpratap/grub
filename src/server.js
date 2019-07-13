'use-strict';
/**
 * This file handles the starting and working of HTTPS server.
 */

// Require components
require('magic-globals');
const express = require('express');
const server = express();
const dualServer = require('http').createServer(server);
const PATH = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const io = require('socket.io')(dualServer);
const helper = require('./middleware/helper_functions/helper');
const app = require('./app/app');
const gConfig = require('./config/config');
const logger = require('./config/logger');
const authMiddleware = require('./middleware/authMiddleware');

helper.checkSessionSecret();
helper.checkDbUrl();
global.test = 'hello';
/**
 * Connect to database
 */
mongoose.connect(gConfig.dbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
gConfig.dbConnection = db;

//  Add middleware
server.set('view engine', 'pug');
server.set('views', PATH.join(__dirname, 'views'));
server.use(express.static(PATH.join(__dirname, 'public')));
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cookieParser());
server.use(session({
  secret: gConfig.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: gConfig.dbConnection,
  }),
}));
//  Use the checkSession middleware to express
server.use(authMiddleware.checkSession);
//  Route all http request to app
server.all('*', app);

db.once('open', ()=>{
  logger.info('[%s] , Connected to database', __file);

  //  Start HTTP server
  helper.startServer(dualServer, io);
});

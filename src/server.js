'use-strict';
/**
 * @author Ayush Pratap Singh
 * @file server.js
 * @description This file is the entry point of the application
 */

// Require npm components
require('magic-globals');
const express = require('express');
const server = express();
const http = require('http').createServer(server);
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const io = require('socket.io')(http);
const favicon = require('express-favicon');

//  Require application modules
const helper = require('./helpers/helperFunctions');
const gConfig = require('./config/config');
const logger = require('./config/logger');
const socketEvents = require('./helpers/socketEvents');

//  Get the routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const api = require('./routes/api');

//  Get the custom middleware
const authMiddleware = require('./middleware/authMiddleware');

//  Check if session secret is set or not
helper.checkSessionSecret();

//  Check if database URL is set or not
helper.checkDbUrl();

//  Connect to database
mongoose.connect(gConfig.dbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
});

//  Get the connection object
const db = mongoose.connection;

// Add the connection object to global config object
gConfig.dbConnection = db;

//  Add template engine middleware
server.set('view engine', 'pug');

//  Add views directory to the middleware
server.set('views', path.join(__dirname, 'views'));

//  Add favicon middleware
server.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));

//  Add the public directory to middleware
server.use(express.static(path.join(__dirname, 'public')));

//  Add middleware to handle JSON object
server.use(express.json());

//  Add middleware to handle strings or arrays
server.use(express.urlencoded({extended: true}));

//  Add middleware to handle and parse cookie
server.use(cookieParser());

//  Add session middleware
server.use(session({
  secret: gConfig.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: gConfig.dbConnection,
  }),
}));

//  Add the custom middleware to check if session is set or not
server.use(authMiddleware.checkSession);

server.use('/', index);
server.all('/login', auth);
server.all('/register', auth);
server.all('/logout', auth);
server.all('/api/*', api);

//  Check if connected to database or not
db.once('open', (err)=>{
  if (err) {
    logger.error(`[${__file}] , Error : ${err}`);
    throw err;
  }
  logger.info('[%s] , Connected to database', __file);

  //  Start the HTTP server
  http.listen(gConfig.port, function(err) {
    if (err) {
      throw err;
    }
    const url = `http://localhost:${gConfig.port}`;
    logger.info(`[${__file}] , HTTP server is at ${url}`);
  });

  //  socket on connected event
  socketEvents.onConnection(io);
});

'use-strict';
/**
 * This file handles the starting and working of HTTPS server.
 */

// Require components
require('magic-globals');
const EXPRESS      = require('express');
const server       = EXPRESS();
const dualServer   = require('http').createServer(server);
const IP           = require('ip');
const PATH         = require('path');
const COOKIEPARSER = require('cookie-parser');
const SESSION      = require('express-session');
const MONGOOSE     = require('mongoose');
const MONGOSTORE   = require('connect-mongo')(SESSION);
const io           = require('socket.io')(dualServer);
const helper = require('./middleware/helper_functions/helper');
const APP          = require('./app/app');
var CONFIG         = require('./config/config');
const logger       = require('./config/logger');

helper.checkSessionSecret();
helper.checkDbUrl();

/**
 * Connect to database
 */
MONGOOSE.connect(CONFIG.db_url,{
    useCreateIndex:true,
    useNewUrlParser:true
});

var db = MONGOOSE.connection;
CONFIG.db_connection = db;

//  Add middlewares
server.set('view engine','pug');
server.set('views',PATH.join(__dirname,'views'));
server.use(EXPRESS.static(PATH.join(__dirname,'public')));
server.use(EXPRESS.json());
server.use(EXPRESS.urlencoded({extended:true}));
server.use(COOKIEPARSER());
server.use(SESSION({
    secret:CONFIG.session_secret,
    resave:false,
    saveUninitialized:true,
    store: new MONGOSTORE({
        mongooseConnection:CONFIG.db_connection
    })
}));

//  Route all http request to app
server.all('*',APP);

db.once('open',()=>{
    logger.info("[%s] , [] , Connected to database",__file);

    //  Start HTTP server
    helper.startServer(dualServer,io);
});
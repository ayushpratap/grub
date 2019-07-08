/**
 * This file handles the starting and working of HTTPS server.
 */

// Require components
require('magic-globals');
const EXPRESS      = require('express');
const FS           = require('fs');
const IP           = require('ip');
const PATH         = require('path');
const COOKIEPARSER = require('cookie-parser');
const SESSION      = require('express-session');
const MONGOOSE     = require('mongoose');
const MONGOSTORE   = require('connect-mongo')(SESSION);
const APP          = require('./app/app');
var CONFIG         = require('./config/config');
const logger       = require('./config/logger');
const server       = EXPRESS();

/**
 * Connect to database
 */
if("NULL" == CONFIG.db_url)
{
    logger.error("[%s] , DB_URL is not configured",__file);
    logger.info("[%s] , Exit the application",__file);
    process.exit(1);
}
logger.info("[%s] , db_url = [%s]",__file,CONFIG.db_url);
MONGOOSE.connect(CONFIG.db_url,{
    useCreateIndex:true,
    useNewUrlParser:true
});
//MONGOOSE.Promise = global.Promise;
CONFIG.db_connection = MONGOOSE.connection;


server.set('view engine','pug');
server.set('views',PATH.join(__dirname,'views'));
server.use(EXPRESS.static(PATH.join(__dirname,'public')));
server.use(EXPRESS.json());
server.use(EXPRESS.urlencoded({extended:true}));
server.use(COOKIEPARSER());

if("NULL" == CONFIG.session_secret){
    logger.error("[%s] , Session secret is not set",__file);
    logger.info("[%s] , Exit the application",__file);
    process.exit(1);
}

server.use(SESSION({
    secret:CONFIG.session_secret,
    resave:false,
    saveUninitialized:true,
    store: new MONGOSTORE({
        mongooseConnection:CONFIG.db_connection
    })
}));
server.all('*',APP);
CONFIG.db_connection.once('open',()=>{
    logger.info("[%s] , Connected to database",__file);
    logger.info("[%s] , starting the http server",__file);
    server.listen(CONFIG.port,()=>{
        logger.info("[%s] , HTTPS server running at [%s:%s]",__file,IP.address(),CONFIG.port);
    });
});
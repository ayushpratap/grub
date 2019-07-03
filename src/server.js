/**
 * This file handles the starting and working of HTTPS server.
 */

 // Require components
 require('magic-globals');
 const EXPRESS  = require('express');
 const FS       = require('fs');
 const HTTPS    = require('https');
 const IP       = require('ip');
 const PATH     = require('path');
 const APP      = require('./app/app');
 const CONFIG   = require('./config/config');
 const logger   = require('./config/logger');
 const server   = EXPRESS();

 server.set('view engine','pug');
 server.set('views',PATH.join(__dirname,'views'));
 server.use(EXPRESS.static(PATH.join(__dirname,'public')));
 server.use(EXPRESS.json());
 server.use(EXPRESS.urlencoded({extended:true}));

 const privateKey = FS.readFileSync('./certs/server.key');
 const certificate = FS.readFileSync('./certs/server.crt');
 const credentials = {key:privateKey,cert:certificate};
 const httpsServer = HTTPS.createServer(credentials,server);
 
 server.all('*',APP);
 httpsServer.listen(CONFIG.port,()=>{
     logger.info("[%s] , HTTPS server running at [%s:%s]",__file,IP.address(),CONFIG.port);
 });
const CONFIG    = require('./config');
const WINSTON   = require('winston');
const FS        = require('fs');
const APPROOT   = require('app-root-path');
const LOG_DIR   = APPROOT+'/logs';
const TIMESTAMP = 'DD-MM-YYYY HH:mm:ss';
const LOG_FILE  = LOG_DIR+'/log.json';

if(!FS.existsSync(LOG_DIR))
{
	FS.mkdirSync(LOG_DIR);
}

const LOGGER = WINSTON.createLogger({
    format: WINSTON.format.combine(
        WINSTON.format.splat(),
        WINSTON.format.timestamp({
            format: TIMESTAMP
        })
    ),
    transports:[
        new WINSTON.transports.File({
            format: WINSTON.format.combine(
                WINSTON.format.json(),
                WINSTON.format.prettyPrint(),
                WINSTON.format.printf(
                    info => `${info.timestamp} ${info.level} : ${info.message}`,
                    debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
                    error => `${error.timestamp} ${error.level} : ${error.message}`
                )
            ),
            filename: LOG_FILE,
            level: 'silly'
        }),
        new WINSTON.transports.Console({
            level: CONFIG.app_env === 'dev' ? 'debug' : 'info',
            format: WINSTON.format.combine(
                WINSTON.format.colorize(),
                WINSTON.format.printf(
                    info => `${info.timestamp} ${info.level} : ${info.message}`,
                    debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
                    error => `${error.timestamp} ${error.level} : ${error.message}`
                )
            )
        })
    ]
});

module.exports = LOGGER;
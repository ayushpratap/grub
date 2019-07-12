'use-strict';
const gConfig = require('./config');
const winston = require('winston');
const fs = require('fs');
const appRoot = require('app-root-path');
const logDir = appRoot+'/logs';
const timeStamp = 'DD-MM-YYYY HH:mm:ss';
const logFile = logDir+'/log.log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp({
        format: timeStamp,
      })
  ),
  transports: [
    new winston.transports.File({
      format: winston.format.combine(
          winston.format.json(),
          winston.format.prettyPrint(),
          winston.format.printf(
              (info) => `${info.timestamp} ${info.level} : ${info.message}`,
              (debug) => `${debug.timestamp} ${debug.level} : ${debug.message}`,
              (error) => `${error.timestamp} ${error.level} : ${error.message}`
          )
      ),
      filename: logFile,
      level: 'silly',
    }),
    new winston.transports.Console({
      level: gConfig.appEnv === 'dev' ? 'debug' : 'info',
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(
              (info) => `${info.timestamp} ${info.level} : ${info.message}`,
              (debug) => `${debug.timestamp} ${debug.level} : ${debug.message}`,
              (error) => `${error.timestamp} ${error.level} : ${error.message}`
          )
      ),
    }),
  ],
});

module.exports = logger;

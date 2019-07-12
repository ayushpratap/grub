'use-restrict';
require('dotenv').config();

const CONFIG={};

CONFIG.port = process.env.HTTPS_PORT || 8081;
CONFIG.appEnv = process.env.APP_ENV || 'dev';
CONFIG.dbUrl = process.env.DB_URL || 'NULL';
CONFIG.sessionSecret = process.env.SESSION_SECRET || 'NULL';

module.exports = CONFIG;

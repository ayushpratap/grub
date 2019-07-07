require('dotenv').config();

var CONFIG={};

CONFIG.port         = process.env.HTTPS_PORT    || 8081;
CONFIG.app_env      = process.env.APP_ENV       || 'dev';
CONFIG.test_name    = process.env.TEST_NAME     || 'Ayush';
CONFIG.db_url       = process.env.DB_URL        || "NULL";
CONFIG.session_secret = process.env.SESSION_SECRET || "NULL";

module.exports = CONFIG;
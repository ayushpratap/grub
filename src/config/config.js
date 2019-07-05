require('dotenv').config();

var CONFIG={};

CONFIG.port         = process.env.HTTPS_PORT    || 8081;
CONFIG.app_env      = process.env.APP_ENV       || 'dev';
CONFIG.test_name    = process.env.TEST_NAME     || 'Ayush';

module.exports = CONFIG;
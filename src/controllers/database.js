'use-strict';
require('magic-globals');
const logger = require('../config/logger');
const FILE = __file;
module.exports.getUserList = function(req, res) {
  const FUNC = 'getUserList';
  logger.info('[%s] , [%s] , Fetching list of users', FILE, FUNC);
};

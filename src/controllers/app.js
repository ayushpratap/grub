'use-strict';

require('magic-globals');
const logger = require('../helpers/logger');
/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
const FILE = __file;
module.exports.main = function(req, res) {
  const FUNC = 'main';
  logger.info(`[${FILE}] , [${FUNC}] , Render the main page`);
  res.render('main', {
    title: 'Main Page',
    username: req.session.username,
    userId: req.session.userId,
  });
};

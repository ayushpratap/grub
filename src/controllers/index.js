'use-strict';

require('magic-globals');
const logger = require('../helpers/logger');

module.exports = function(req, res) {
  const FUNC = 'index';
  logger.info(`[${__file}] , [${FUNC}] , Process the index request`);
  logger.info(`[${__file}] , [${FUNC}] , Render the homepage`);
  res.render('homepage', {title: 'homepage'});
};

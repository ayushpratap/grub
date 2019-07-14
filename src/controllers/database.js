'use-strict';
require('magic-globals');
const logger = require('../config/logger');
const userModel = require('../models/User');
const FILE = __file;

module.exports.getUserList = function(req, res) {
  const FUNC = 'getUserList';
  logger.info(`[${FILE}] , [${FUNC}] , Fetching list of users`);
  //  Fetch all users except the current user
  userModel.find({name: {$nin: [req.session.username]}})
      .lean()
      .exec(function(err, users) {
        if (err) {
          logger.error(`[${FILE}] , [${FUNC}] , Error : ${err}`);
          throw err;
        } else {
          logger.info(`[${FILE}] , [${FUNC}] , Fetched users`);
          const list = [];
          users.forEach(function(user) {
            //  Add all the users to the list array
            list.push(user.name);
          });
          logger.debug(`[${FILE}] , [${FUNC}] , user list array ${list}`);
          //  create response object
          const userList = {list: list};
          logger.debug(`[${FILE}] , [${FUNC}] , response object %o`, userList);
          res.send(userList);
        }
      });
};

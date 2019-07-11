'use-stric';

require('magic-globals');
const g_config = require('../../config/config');
const logger = require('../../config/logger');
const check = require('check-types');
const EXIT_MESSAGE = "Exit the application :";
/**
 *
 *
 * @returns bool
 */
module.exports.checkSessionSecret = function()
                                    {
                                        
                                        //  Check if session secret is set
                                        if(
                                            check.emptyString(g_config.session_secret) ||
                                            check.null(g_config.session_secret)        ||
                                            check.undefined(g_config.session_secret)
                                            )
                                            {
                                                logger.error("[%s] , [checkSessionSecret] , %s Session secret is not set",__file,EXIT_MESSAGE);
                                                process.exit(1);
                                            }
                                        else
                                        {
                                            logger.debug("[%s] , [checkSessionSecret] , Session secret is = %s",__file,g_config.session_secret);
                                            return true;
                                        }
                                    }
/**
 *
 *
 * @returns bool
 */
module.exports.checkDbUrl = function()
                            {
                                //  Check if url for connecting to database is present in configuration or not
                                if(
                                    check.emptyString(g_config.db_url)  ||
                                    check.null(g_config.db_url)         ||
                                    check.undefined(g_config.db_url)
                                )
                                {
                                    logger.error("[%s] , [checkDbUrl] , %s DB url is not set",__file,EXIT_MESSAGE);
                                    process.exit(1);
                                }
                                else
                                {
                                    logger.debug("[%s] , [checkDbUrl] , DB url is = %s",__file,g_config.db_url);
                                    return true;
                                }
                            }
/**
 *
 *
 * @param Object http
 * @param Object io
 */
module.exports.startServer = function(http,io)
                            {
                                //  Start HTTP server
                                http.listen(g_config.port,function(err)
                                {
                                    if(err)
                                        throw err;
                                    else
                                        logger.info('[%s] , [startServer] , HTTP server is running at [http://localhost:%s]',__file,g_config.port);
                                });

                                //  Start socket.io server
                                io.on('connection',function(socket)
                                {               
                                    logger.info('[%s] , [startServer] , socket.io client connected',__file);
                                });
                            }
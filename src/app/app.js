// TODO : List all useres on homepage
require('magic-globals');
const EXPRESS = require('express');
const isUndefined = require('is-undefined');
const isEmpty = require('is-empty');
const bcrypt = require('bcrypt');
const CONFIG = require('../config/config');
const LOGGER = require('../config/logger');
var User    = require('../models/User');
const ROUTER = EXPRESS.Router();

/**
 * This route loads the homepage of the application
 * If the user is alread logged in then user will be
 * redirected to the main page.
 */
ROUTER.get('/',(req,res)=>{
    LOGGER.info('--------------------------------------------------------------------------------');
    LOGGER.info("[%s] , GET /",__file);

    /**
     * Check if req.session.username is set or not.
     * If it is empty of undefined then that means
     * session is not set.
     * If session is not set then render the homepage.
     * If session is set then redirect the user to the
     * main page.
     */
    if(isUndefined(req.session.username) || isEmpty(req.session.username))
    {
        LOGGER.info("[%s] , session is not set",__file);
        LOGGER.info("[%s] , render the home page",__file);
        res
            .status(200)
            .render('homepage',{
                name:"Ayush",
                test_name:CONFIG.test_name,
                title:'homepage'
            });
    }
    else
    {
        LOGGER.info("[%s] , session is set , session.username = [%s]",__file,req.session.username);
        LOGGER.info("[%s] , redirect the use to main page",__file);
        res
            .status(200)
            .redirect('/main');
    }
});

/**
 * This route loads the main page of the application.
 * If the user is logged in then render the main page
 * else redirect the user to the homepage.
 */
ROUTER.get('/main',(req,res)=>{
    LOGGER.info('--------------------------------------------------------------------------------');
    LOGGER.info("[%s] , GET /main",__file);
    
    /**
     * Check if req.session.username is set or not.
     * If it is undefined or empty then that means
     * session is not set otherwise it means session 
     * is set and user is logged in.
     * So if session is set then render the main page
     * else redirect the user to the login page.
     */
    if(isUndefined(req.session.userId) || isEmpty(req.session.userId))
    {
        LOGGER.info("[%s] , session is not set ",__file);
        LOGGER.info("[%s] , redirect the user to login page",__file);
        res
            .status(200)
            .redirect('/login');
    }
    else
    {
        LOGGER.info("[%s] , session is set = [%s]",__file,req.session.username);
        LOGGER.info("[%s] , render the main page",__file);
        res
            .status(200)
            .render("main",{
                username:req.session.username,
                userId:req.session.userId
            });
    }
});

/**
 * This route loads the registration page of the application
 */
ROUTER.get('/register',(req,res)=>{
    LOGGER.info('--------------------------------------------------------------------------------');
    LOGGER.info("[%s] , GET /register",__file);
    if(isUndefined(req.session.userId) || isEmpty(req.session.userId))
    {
        //  Session is not set
        LOGGER.info("[%s] , session is not set, render the registration page",__file);
        res
            .status(200)
            .render("register",{
                title:"Register Page"
            });
    }
    else
    {
        //  Session is set
        LOGGER.info("[%s] , session is set , redirct to main page");
        res.redirect('/main');
    }

});

ROUTER.post('/register',(req,res,next)=>{
    LOGGER.info('--------------------------------------------------------------------------------');
    LOGGER.info("[%s] , POST /register",__file)

    //  Check if session is already set
    if(isUndefined(req.session.userId) || isEmpty(req.session.userId))
    {
        //  Session is not set
        //  Check if all the fileds filled or not
        if(
            req.body.email &&
            req.body.username &&
            req.body.password &&
            req.body.cPassword
        )
        {
            // Confirm if the password and confirm password are same or not
            if(req.body.password !== req.body.cPassword)
            {
                var err = new Error('Password do not match');
                err.status = 400;
                res.send('Password do not match');
                return next(err);
            }  
            //  Create a user data object
            var userData = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password:req.body.password
            };
            User.create(userData,(error,user)=>{
                if(error)
                {
                    return next(error);
                }
                else
                {
                    //  Set the user id as current session id
                    req.session.userId = user._id;
                    req.session.username = req.body.username;

                    // Redirect to the main page
                    return res.redirect('/main');
                }
            });
        }
    }
    else
    {
        //  Session is already set
        res.redirect('/main');
    }
});

/**
 * This route loads the login page of the application.
 */
ROUTER.get('/login',(req,res)=>{
    LOGGER.info('--------------------------------------------------------------------------------');
    LOGGER.info("[%s] , GET /login",__file);
    
    /**
     * Check if req.session.username is set or not.
     * If it is set then it means user is logged in.
     * If session is set then redirect the user to
     * main page.
     * Else render the login page.
     */
    if(isUndefined(req.session.userId) || isEmpty(req.session.userId))
    {
        LOGGER.info("[%s] , session is not set, render login page",__file);
        res
            .status(200)
            .render("login",{
                title:"Login Page"
            });
    }
    else
    {
        LOGGER.info("[%s] , session is set to = [%s], so redirect to main page",__file,req.session.userId);
        res
            .status(200)
            .redirect('/main');
    }    
});
ROUTER.get('/logout',(req,res)=>{
    LOGGER.info('--------------------------------------------------------------------------------');
    LOGGER.info("[%s] , GET /logout",__file);
    req.session.destroy((err)=>{
        if(err)
        {
            LOGGER.error("[%s] , %o",__file,err);
        }
        LOGGER.info("[%s] , session destroyed and redirect the user to homepage",__file);
        res.redirect('/');
    });
});
ROUTER.post('/login',(req,res,next)=>{
    /**
     * Existing user trying to login
     */
    LOGGER.info('--------------------------------------------------------------------------------');
    LOGGER.info("[%s] , POST /login",__file);
    LOGGER.info("[%s] , Request received to login",__file);
    LOGGER.info("[%s] , %o",__file,req.body);

    //  Check if seesion is already established
    if(isUndefined(req.session.userId) || isEmpty(req.session.userId))
    {
        //  Session is not set
        LOGGER.info("[%s] , session is not set, so set the username to the session",__file);
        
        //  Check if userame and password are filled
        if(req.body.username && req.body.password)
        {
            LOGGER.info("[%s] , Username and password are filled",__file);
            //  Authenticate the user
            User.findOne({username:req.body.username})
                .exec(function(err,user){
                    if(err)
                    {
                        throw err;
                    }
                    else if(isUndefined(user) || isEmpty(user) || null == user)
                    {
                        res
                            .status(401)
                            .send('User do not exists hr <a href="/">Home</a>');
                    }
                    else
                    {
                        bcrypt.compare(req.body.password, user.password,function(err,result){
                            if(true == result)
                            {
                                req.session.userId = user._id;
                                req.session.username = user.username;
                                res.redirect('/main');
                            }
                        });
                    }
                });
        }
    }
    else{
        //  Session is set
        LOGGER.info("[%s] , session is set , so redirect the user to main page",__file);
        res
            .status(200)
            .redirect('/main');
    }
});

module.exports = ROUTER;
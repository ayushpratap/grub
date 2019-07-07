require('magic-globals');
const EXPRESS = require('express');
const CONFIG = require('../config/config');
const LOGGER = require('../config/logger');
const ROUTER = EXPRESS.Router();

ROUTER.get('/',(req,res)=>{
    LOGGER.info("[%s] , Request received at ROUTER.get('/')",__file);
    let session = req.session;
    if(session.username){
        return res.redirect('/main');
    }else{
       res.render("homepage",{
            name:'Ayush',
            test_name:CONFIG.test_name,
            siteName: 'Grub',
            title:'homepage'
        });
    }
});
ROUTER.get('/main',(req,res)=>{
    if(req.session.username){
        res
            .status(200)
            .render('main',{
            username:req.session.username
        });
    }else{
        res
            .status(200)
            .redirect('/login');
    }
});
ROUTER.get('/register',(req,res)=>{
    LOGGER.info("[%s] , Request received to render register page",__file);
    res
        .status(200)
        .render("register",{
            title:"Register Page"
        });

});
ROUTER.post('/register',(req,res)=>{
    /**
     * Add a new user
     */
    LOGGER.info("[%s] , Request received to add new user",__file);
    LOGGER.info("[%s] , %o",__file,req.body);

    res
        .status(200)
        .send(req.body);
});

ROUTER.get('/login',(req,res)=>{
    LOGGER.info("[%s] , Request received to render login page",__file);
    res
        .status(200)
        .render("login",{
            title:"Login Page"
        });
});
ROUTER.post('/login',(req,res)=>{
    /**
     * Existing user trying to login
     */
    LOGGER.info("[%s] , Request received to login",__file);
    LOGGER.info("[%s] , %o",__file,req.body);
    if(req.session.username){
        res
            .status(200)
            .redirect('/main');
    }
    else{
        if("ayush" == req.body.username){
            req.session.username = req.body.username;
            res
                .status(200)
                .redirect('/main');
        }
        else{
            res
                .status(200)
                .redirect('/')
        }
    }
});

module.exports = ROUTER;
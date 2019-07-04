require('magic-globals');
const EXPRESS = require('express');
const LOGGER = require('../config/logger');
const ROUTER = EXPRESS.Router();

ROUTER.get('/',(req,res)=>{
    LOGGER.info("[%s] , Request received at ROUTER.get('/')",__file);

    res
        .status(200)
        .send("Hello")
        .end();
    /*res.render("homepage",{
        name:'Ayush',
        siteName: 'Grub'
    });*/
});

ROUTER.post('/register',(req,res)=>{
    /**
     * Add a new user
     */
    LOGGER.info("[%s] , Request received to add new user",__file);
    LOGGER.info("[%s] , %o",__file,req.body);

    res.sendStatus(200);
});

ROUTER.post('/login',(req,res)=>{
    /**
     * Existing user trying to login
     */
    LOGGER.info("[%s] , Request received to login",__file);
    LOGGER.info("[%s] , %o",__file,req.body);
    res.sendStatus(200);
});

module.exports = ROUTER;
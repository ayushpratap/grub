require('magic-globals');
const EXPRESS = require('express');
const LOGGER = require('../config/logger');
const ROUTER = EXPRESS.Router();

ROUTER.get('/',(req,res)=>{
    LOGGER.info("[%s] , Request received at ROUTER.get('/')",__file);

    //res.send("Hello");
    res.render("homepage",{
        name:'Ayush',
        siteName: 'Grub'
    });
});

module.exports = ROUTER;
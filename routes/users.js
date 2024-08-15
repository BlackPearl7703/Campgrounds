const express=require('express')
const router=express.Router();
const User=require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const {regForm,regFormSub,loginForm,loginFormSub,logoutBut}=require('../controller/users')


router.get('/register',regForm)
router.post('/register',regFormSub)


router.get('/login',loginForm)

router.post('/login', 
      storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),
      loginFormSub)


router.get('/logout', logoutBut); 

module.exports=router;
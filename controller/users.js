const User=require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
module.exports.regForm=(req,res)=>{
    res.render('users/register')
}

module.exports.regFormSub=async(req,res)=>{
    try{
         const {username,email,password}=req.body;

  const user=new User({username,email});
  const validuser= await User.register(user,password);
//   const showname=username.toCapitalize();
   req.login(validuser,err=>{
    if(err)  return next(err);

    req.flash('success',`You are signed in ${username}`)
    res.redirect('/campgrounds')
   })
// res.send(req.body)
    }
    catch(e)
    {
        req.flash('error',`${e.message}`)
        res.redirect('register')
    }
 

}


module.exports.loginForm=(req,res)=>{
    res.render('users/login')
}


module.exports.loginFormSub=(req,res)=>{
    // res.send(req.body)
    req.flash('success',`welcome back ${req.body.username}`)
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutBut=(req, res, next) => {
    // console.log(req.body)
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', `Goodbye!`);
        res.redirect('/campgrounds');
    });
}
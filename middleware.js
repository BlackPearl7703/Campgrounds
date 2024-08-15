const Review=require('./models/review')

module.exports.isLoggedIn=(req,res,next)=>{
    console.log("request.user....",req.user);
    if(!req.isAuthenticated())
        {
          req.session.returnTo = req.originalUrl; // use to store in session where to go 
          req.flash('error','who the hell are you ?')
       return   res.redirect('/login')
        }
        next();
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo; // use to store in local from session where to go
  }
  next();
}
// console.log(this.isReviewAuther)
module.exports.isReviewAuther=async(req,res,next)=>{
const {id,rid}=req.params;
const review =await Review.findById(rid)
if(!review.auther.equals(req.user.id))
  {
    req.flash('error','you do not have permission for this' )
   return req.redirect(`/campgrounds/${id}`)
  }

  next();
}

const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.newReview=async (req, res,next) => {
   
    // console.log("prince",req.body);
    
    //   const reviewSchema=Joi.object({
    //     review:Joi.object({
    //       rating:Joi.number().required(),
    //       review:Joi.string().required(),
         
    //     }).required()
    //    })
    //    const result =reviewSchema.validate(req.body)
    //     console.log("res",result)
    //     console.log( "body h bhai ",req.body);
    
    
    const camp=await Campground.findById(req.params.id);
    console.log("this is camp",camp)
    const review=new Review(req.body.review);
    review.auther=req.user._id;
    await review.save();
    camp.reviews.push(review);
  //   console.log("yaha to pahuch gya ",review)
      await camp.save();
      req.flash('success','created new review')
      // console.log("ab ye review h", review);
      res.redirect(`/campgrounds/${camp.id}`)
    
    
    }

    module.exports.deleteReview=async(req,res,next)=>
        {
          const {id,rid}=req.params;
          console.log(req.params)
          const camp = await Campground.findById(req.params.id).populate('reviews');
          await Campground.findByIdAndUpdate(id,{$pull : { reviews:rid}});
          await Review.findByIdAndDelete(rid)
          req.flash('success','deleted review')
          res.redirect(`/campgrounds/${id}`);
          // res.send("deleted")
        }
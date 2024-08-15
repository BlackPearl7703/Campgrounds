const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const Joi = require("joi");
const { isLoggedIn } = require("../middleware");
const multer=require('multer');
const {storage}=require('../cloudinary')
const upload=multer({storage})

const {
  index,
  newForm,
  putNewForm,
  updateCamp,
  editCamp,
  deleteCamp,
  showCamp
} = require("../controller/campgrounds");

const session = require("express-session");
const passport = require("passport");


// clubbing up the same route requesting though they are having different kind of works
router.route('/')
.get( index)                  
.post(upload.array('image'), catchAsync(putNewForm));
// .post(upload.array('image'),(req,res)=>{
//   res.send(req.files)
// })

//ends here

router.get("/new",  newForm);

router.get("/:id/edit", editCamp);

router.put("/:id",upload.array('image'), catchAsync(updateCamp));

router.delete("/:id", deleteCamp);

router.get( "/:id", catchAsync(showCamp));

// router.post('/:id/reviews',catchAsync( async (req, res,next) => {

// // console.log("prince",req.body);

// //   const reviewSchema=Joi.object({
// //     review:Joi.object({
// //       rating:Joi.number().required(),
// //       review:Joi.string().required(),

// //     }).required()
// //    })
// //    const result =reviewSchema.validate(req.body)
// //     console.log("res",result)
// //     console.log( "body h bhai ",req.body);

//   const camp=await Campground.findById(req.params.id);
//   const review=new Review(req.body.review);
//   await review.save();
//   camp.reviews.push(review);
//   await camp.save();
//   console.log("ab ye review h", review);
//   res.redirect(`/campgrounds/${camp.id}`)

// }))

// router.delete('/:id/reviews/:rid',catchAsync(async(req,res,next)=>
// {
//   const {id,rid}=req.params;
//   console.log(req.params)
//   const camp = await Campground.findById(req.params.id).populate('reviews');
//   await Campground.findByIdAndUpdate(id,{$pull : { reviews:rid}});
//   await Review.findByIdAndDelete(rid)
//   res.redirect(`/campgrounds/${id}`);
//   // res.send("deleted")
// }))

module.exports = router;

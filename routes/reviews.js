const express=require('express')
const router= express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync=require('../utils/CatchAsync')
const AppError=require('../utils/AppError')
const Joi = require("joi");
const {isReviewAuther,isLoggedIn}=require('../middleware')
const {newReview,deleteReview}=require('../controller/reviews')
  
  router.post('/',catchAsync( newReview))
  console.log("hello from review",isReviewAuther)
  router.delete('/:rid',isLoggedIn,isReviewAuther,catchAsync(deleteReview))

  module.exports=router;
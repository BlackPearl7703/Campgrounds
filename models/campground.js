const mongoose = require("mongoose");
const User = require("./user");
const Schema = mongoose.Schema;
const Review = require("./review");
const { string, required } = require("joi");
const campgroundSchema = Schema({
  title: String,
  images:[
    {
      url:String,
      path:String
    }
  ] ,
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  price: Number,
  description: String,
  location: String,
  auther: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  
  ],

});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  // console.log("deleted",doc)
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      }
    })
  }
});
module.exports = mongoose.model("Campground", campgroundSchema);

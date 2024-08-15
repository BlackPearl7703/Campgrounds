const { string } = require('joi');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const User=require('./user')




const reviewSchema=new Schema({
    body:String,
    rating:Number,
    auther: {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
})





module.exports=mongoose.model('Review',reviewSchema);
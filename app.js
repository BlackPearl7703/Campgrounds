if(process.env.NODE_ENV!=='production')
  {
    require('dotenv').config();
  }
console.log(process.env.SECRET)
const express = require("express");
const app = express();
const path = require("path");
const flash= require('connect-flash');
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Review = require("./models/review");
const catchAsync=require('./utils/CatchAsync')
const AppError=require('./utils/AppError')


const campgroundsRoutes=require('./routes/campgrounds')
const reviewsRoutes=require('./routes/reviews')
const usersRoutes=require('./routes/users')


const session=require('express-session')
const passport=require('passport')
const localStrategy=require('passport-local')
const User=require('./models/user')

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(flash());
const sessionConfig={
  secret:'thisisnotsecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true
  }
}
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  // console.log("hello")
  next();
})


app.use('/campgrounds',campgroundsRoutes)
app.use('/',usersRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)
app.use(express.static(path.join(__dirname, "public")));


// getting-started.js
const mongoose = require("mongoose");
const campground = require("./models/campground");
const Joi = require("joi");
const { descriptors } = require("./seeds/seedHelpers");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
  useNewUrlParser: true,
  // useCreateIndex:true,
  useUnifiedTopology: true,
  // useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected!!");
});

// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

app.listen(3000, () => {
  console.log("listening at 3000");
});

app.get("/", (req, res) => {
  // res.send("welcome to camp!!")
  res.render("campground/home");
});

app.get('/fakeuser',async(req,res)=>{
  const user=new User({username:'prince',email:'princekoshti7703@gmail.com'});
  const new_user=await User.register(user,'77prince');
  res.send(new_user)
})

// app.get("/campgrounds", async (req, res) => {
//   const camps = await Campground.find({});
//   console.log(camps.data);
//   res.render("campground/index", { camps });
// });
// app.get("/campgrounds/new", (req, res) => {
//   res.render("campground/new");
// });
// app.post("/campgrounds", catchAsync(async (req, res) => {
//   // res.send(req.body)
//   console.log("prince koshti",req.body)
 

//  const campgroundSchema=Joi.object({
//   campground:Joi.object({
//     title:Joi.string().required(),
//     location:Joi.string().required(),
//     image:Joi.string().required(),
//     description:Joi.string().required(),
//     price:Joi.number().required(),
//   }).required()
//  })
//  const result =campgroundSchema.validate(req.body)
//  console.log(result)
//   console.log(req.body);


//   const camp = new Campground(req.body.campground);
//   await camp.save();
//   res.redirect(`/campgrounds/${camp.id}`);
// }));

// app.put("/campgrounds/:id",catchAsync(async (req, res,next) => {
//   // res.send("it worked!!");
//   const { id } = req.params;
//   const c = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//   console.log({ ...req.body.campground });
//   res.redirect(`/campgrounds/${c.id}`);
// }));
// app.get("/campgrounds/:id/edit", async (req, res) => {
//   const camp = await Campground.findById(req.params.id);
//   res.render("campground/edit", { camp });
// });
// app.delete("/campgrounds/:id", async (req, res) => {
//   const { id } = req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect("/campgrounds");
// });

// app.get("/campgrounds/:id",catchAsync( async (req, res,next) => {
//   const camp = await Campground.findById(req.params.id).populate('reviews');
//   console.log(camp)
//   res.render("campground/show", { camp });
// }));

// app.post('/campgrounds/:id/reviews',catchAsync( async (req, res,next) => {
 
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

// app.delete('/campgrounds/:id/reviews/:rid',catchAsync(async(req,res,next)=>
// {
//   const {id,rid}=req.params;
//   console.log(req.params)
//   const camp = await Campground.findById(req.params.id).populate('reviews');
//   await Campground.findByIdAndUpdate(id,{$pull : { reviews:rid}});
//   await Review.findByIdAndDelete(rid)
//   res.redirect(`/campgrounds/${id}`);
//   // res.send("deleted")
// }))

app.all('*',(req,res,next)=>{
  // res.send('404!!!');
  next(new AppError('page not found',404))
})
app.use((err, req, res, next) => {
  // res.send("oh ladke kuch galat ho gya!");
  const {status=500,message='something wromg here'}=err;
  res.status(status).render('error' ,{status,message});
});


const Campground = require("../models/campground");
const Joi = require("joi");
const {cloudinary} =require('../cloudinary')
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken=process.env.MAPBOX_TOKEN
const geocoder=mbxGeocoding({accessToken:mapBoxToken})
module.exports.index=async (req, res) => {
    const camps = await Campground.find({});
    console.log(camps.data);
    res.render("campground/index", { camps });
  }
  module.exports.newForm= async (req, res) => {
    await res.render("campground/new");
  }
  module.exports.putNewForm=async (req, res) => {
    // res.send(req.body)
    // console.log("prince koshti",req.body)
    const geodata=await geocoder.forwardGeocode({
      query:req.body.campground.location,
      limit:1
    }).send()
    // console.log( req.body.campground.location,geodata.body.features[0].geometry.coordinates);
    // res.send(geodata.body.features[0].geometry.coordinates)
    const campgroundSchema = Joi.object({
      campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
      }).required(),
    });
    const result = campgroundSchema.validate(req.body);
    //  console.log(result)
    //   console.log(req.body);
    const camp = new Campground(req.body.campground);
    camp.geometry=geodata.body.features[0].geometry;
    camp.images=req.files.map((f)=>({url:f.path,path:f.filename}))
    camp.auther = req.user._id;
    await camp.save();
    console.log(camp)
    req.flash("success", "successfully created a campground!");
    res.redirect(`/campgrounds/${camp.id}`);
  }

  module.exports.updateCamp=async (req, res, next) => {
    // res.send("it worked!!");
    const { id } = req.params;
    // console.log(req.body)
    const campground = await Campground.findById(id);
    if (!campground.auther.equals(req.user._id)) {
      req.flash("error", "bhago ite se");
      return res.redirect(`/campgrounds/${id}`);
    }
    const c = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    // console.log(req.files);
    const imgs=req.files.map((f)=>({url:f.path,path:f.filename}))

    c.images.push(...imgs)
    await c.save();

console.log("pk###",req.body.deleteImages)
    if(req.body.deleteImages)
      {
        for(let path of req.body.deleteImages)
          {
           await cloudinary.uploader.destroy(path);

          }
       await campground.updateOne({$pull:{images:{path:{$in:req.body.deleteImages}}}})
        console.log(c);
      }
    // console.log("this is updated camp",c);
    // console.log({ ...req.body.campground });
    res.redirect(`/campgrounds/${c.id}`);
  }

  module.exports.editCamp= async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(req.params.id);
    const campground = await Campground.findById(req.params.id);
    if (!req.user || !campground.auther.equals(req.user._id)) {
      req.flash("error", "bhago ite se");
      return res.redirect(`/campgrounds/${id}`);
    }
    if (!camp) {
      req.flash("error", "the campground does not exist or delted");
      return res.redirect("/campgrounds");
    }
    res.render("campground/edit", { camp });
  }

  module.exports.deleteCamp= async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.auther.equals(req.user._id)) {
      req.flash("error", "bhago ite se");
      return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  }


  module.exports.showCamp= async (req, res, next) => {
    const camp = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("auther")
      .populate({
        path: "reviews",
        populate: {
          path: "auther",
        },
      });
    console.log(camp);
    if (!camp) {
      req.flash("error", "the campground does not exist or delted");
      return res.redirect("/campgrounds");
    }
    res.render("campground/show", { camp });
  }
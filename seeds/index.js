
const Campground=require('../models/campground');
// app.set('view engine','ejs');
// app.set('views',path.join(__dirname,'views'))
// getting-started.js
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers')
const mongoose = require('mongoose');




  mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useUnifiedTopology:true
  });

  const db=mongoose.connection;
  db.on("error",console.error.bind(console,"connection error:"))
  db.once("open",()=>{
    console.log("database connected!!")
  })

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
const sample=array=>array[Math.floor(Math.random()*array.length)]
const seedDb= async()=>{
    await Campground.deleteMany({});
   for(let i=0;i<50;i++)
    {
        const rand1000= Math.floor(Math.random()*1000);
        const pric= Math.floor(Math.random()*20)+1;
        const camp=new Campground({
             auther: '667858aba96e8bbf2e666246',
            location:`${cities[rand1000].city} , ${cities[rand1000].state}`,
            title:`${sample(descriptors) } ${sample(places)}`,
            images: [
              {
                url: 'https://res.cloudinary.com/dnxxk4hhg/image/upload/v1719405564/YelpCamp/eo1xudgnadohffprgtt5.jpg',
                path: 'YelpCamp/eo1xudgnadohffprgtt5',
              
              },
              {
                url: 'https://res.cloudinary.com/dnxxk4hhg/image/upload/v1719405564/YelpCamp/wkq0vmvki5dd8a66rjus.jpg',
                path: 'YelpCamp/wkq0vmvki5dd8a66rjus',
             
              },
              {
                url: 'https://res.cloudinary.com/dnxxk4hhg/image/upload/v1719405564/YelpCamp/thonnl5z2bsnpwfc2cro.jpg',
                path: 'YelpCamp/thonnl5z2bsnpwfc2cro',
              
              }
            ],
            description:"this is a very good place though",
            price:pric
        })
        await camp.save();
    }
}

seedDb().then(()=>mongoose.connection.close());
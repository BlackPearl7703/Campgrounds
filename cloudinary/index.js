const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
console.log('Cloud Name:', process.env.CLOUDINARY_NAME);
console.log('API Key:', process.env.CLOUDINARY_KEY);
console.log('API Secret:', process.env.CLOUDINARY_SECRET);

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET,
});

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:'YelpCamp',
    allowedFormats:['jpeg','jpg','png']
    }
})

module.exports={
    cloudinary,
    storage
}
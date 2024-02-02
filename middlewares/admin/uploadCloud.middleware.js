const streamifier = require('streamifier')
const cloudinary = require('cloudinary').v2

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});
// End cloudinary

const uploadCloud = (req, res, next) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        // read data in buffer then upload cloudinary
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    async function upload(req) {
      let result = await streamUpload(req);
      req.body[req.file.fieldname] = result.secure_url;
      next()
    }
    upload(req);
  } else {
    next()
  }
}
module.exports = {
  uploadCloud
}
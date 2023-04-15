const cloudinary = require('../utils/cloudinary');

module.exports = (imagePath) => {
  cloudinary.uploader.destroy(imagePath, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log(result);
  });
};

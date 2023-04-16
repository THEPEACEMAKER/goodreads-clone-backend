const cloudinary = require('../utils/cloudinary');

module.exports = (imagePath) => {
  cloudinary.uploader.destroy(imagePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

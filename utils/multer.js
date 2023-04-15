const multer = require('multer');
const path = require('path');
const cloudinary = require('./cloudinary');
const asyncWrapper = require('./asyncWrapper');

const fileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'images'));
  },
  filename(req, file, cb) {
    cb(null, 'image-' + new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage: fileStorage, fileFilter: fileFilter }).single('image');

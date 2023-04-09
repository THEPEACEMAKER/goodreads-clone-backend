const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

const fileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'images'));
  },
  filename(req, file, cb) {
    cb(null, 'user - ' + new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
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

app.use(cors());
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.json());
app.use(routes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('*', notFound);
app.use(errorHandler);

const {
  env: { PORT, MONGO_URL },
} = process;
mongoose.connect(MONGO_URL);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

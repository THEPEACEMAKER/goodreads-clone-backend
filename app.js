const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const imageHandler = require('./middlewares/imageHandler');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(imageHandler);
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

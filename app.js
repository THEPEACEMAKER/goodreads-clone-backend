/* eslint-disable linebreak-style */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(routes);
app.use(errorHandler);
app.use('*', notFound);

const { env: { PORT, MONGO_URL } } = process;
mongoose.connect(MONGO_URL);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

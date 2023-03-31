/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const authorSchema = new Schema({
    firstName: {
        type: string,
        minLength: 3,
        required: true
    },
    lastName: {
        type: string,
        minLength: 3,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    imageUrl: {
        type: string
    },
});

module.exports = mongoose.model('Author', authorSchema);
/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const reviewSchema = new Schema({
    title: {
        typeof: 'string',
        minLnegth: 3,
        required: true
    },
    content: {
        typeof: 'string',
        minLnegth: 3,
        required: true
    },
    rating: {
        typeof: 'number',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);

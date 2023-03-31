/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
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
    userName: {
        type: string,
        minLength: 3,
        required: true,
        unique: true
    },
    email: {
        type: string,
        required: true,
        unique: true
    },
    password: {
        type: string,
        minLength: 8,
        required: true
    },
    imageUrl: {
        type: string
    },
    role: {
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    books: [
        {
            book: {
                type: Schema.Types.ObjectId,
                ref: 'Book'
            },
            shelf: {
                enum: ['WANT TO READ', 'CURRENTLY READING', 'READ']
            }
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
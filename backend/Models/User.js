const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 128,
        min: 6,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 128,
        min: 6
    },
    first_name: {
        type: String,
        required: true,
        max: 64,
        min: 6
    },
    last_name: {
        type: String,
        required: true,
        max: 64,
        min: 6
    },
    mobile: {
        type: String,
        required: true,
        max: 10,
        min: 10
    },
    gender: {
        type: String,
        required: true,
        max: 11,
        min: 4
    },
    address: {
        type: String,
        required: true,
        max: 200,
        min: 2
    },
    role: {
        type: String,
        required: true,
        default: 'Client'
    },
});

module.exports = mongoose.model('User', userSchema, 'users');
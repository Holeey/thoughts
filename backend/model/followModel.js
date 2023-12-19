const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

}) 

const followData = mongoose.model('Follow', followSchema);
module.exports = followData
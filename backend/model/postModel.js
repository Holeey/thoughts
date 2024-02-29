const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postTitle: String,
    postBody: String,
    upvote: [],
    upvoteValue: {
        type: Number,
        default: 0  // Set a default value for upvote value
    },
    downvote: [],
    downvoteValue: {
        type: Number,
        default: 0  // Set a default value for downvote value
    },

}, { timestamps: true });

const postData = mongoose.model('Post', postSchema);
module.exports = postData;

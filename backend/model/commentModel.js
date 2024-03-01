const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    comment: String,
    replies: [],
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
    upvotedBycurrentUser: Boolean,
    downvotedBycurrentUser: Boolean
}, {timestamps: true});

const commentData = mongoose.model('Comment', commentSchema);
module.exports = commentData;

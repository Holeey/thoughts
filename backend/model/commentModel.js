const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Post'
    },
    comment: String,
    replies: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        type: String
    }],
    upvote: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        value: Number,
    }],
    downvote: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        value: Number,
    }],
    upvotedBycurrentUser: Boolean,
    downvotedBycurrentUser: Boolean
}, {timestamps: true});

const commentData = mongoose.model('Comment', commentSchema);
module.exports = commentData;

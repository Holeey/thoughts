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
    upvote: Number,
    downvote: Number
}, {timestamps: true});

const commentData = mongoose.model('Comment', commentSchema);
module.exports = commentData;

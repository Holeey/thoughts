const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reply: String,
    upvote: [],
    upvoteValue: {
        type: Number,
        default: 0
    },
    downvote: [],
    downvoteValue: {
        type: Number,
        default: 0
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }]  // Nested replies
}, { timestamps: true });

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
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }], // Top-level replies
    upvote: [],
    upvoteValue: {
        type: Number,
        default: 0
    },
    downvote: [],
    downvoteValue: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const commentModel = mongoose.model('Comment', commentSchema);
const replyModel = mongoose.model('Reply', replySchema);

module.exports = { commentModel, replyModel };

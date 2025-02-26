const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reply: {
        type: String,
        required: true
    },
    upvote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    upvoteValue: {
        type: Number,
        default: 0
    },
    downvote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvoteValue: {
        type: Number,
        default: 0
    },
    parentReplyId: {  // 👈 NEW: Identifies whether it's a reply to a comment or another reply
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',
        default: null
    },
    commentId: {  // 👈 NEW: Helps query all replies belonging to a comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }
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
    comment: {
        type: String,
        required: true
    },
    upvote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    upvoteValue: {
        type: Number,
        default: 0
    },
    downvote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvoteValue: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
const Reply = mongoose.model('Reply', replySchema);

module.exports = { Comment, Reply };

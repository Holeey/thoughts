const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comment: [{
        body: String,
        meta: {
            upvote: Number,
            downvote: Number
        }
    }]
}, {timestamps: true})

const commentData = mongoose.model('Comment', commentSchema)
module.exports = commentData
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        title: String,
        body: String,
        author: String,
        post_meta : {
            upvote: Number,
            downvote: Number
        }
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Comment'
    }
    
}, {timestamps: true} )

const postData = mongoose.model('Post', postSchema)
module.exports = postData
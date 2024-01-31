const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postTitle: String,
    postBody: String ,
    upvote: Number,
    downvote: Number,
    comments: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
    }
    
}, {timestamps: true} )

const postData = mongoose.model('Post', postSchema)
module.exports = postData
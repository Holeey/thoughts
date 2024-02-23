const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postTitle: String,
    postBody: String,
    upvote: Number,
    downvote: Number,
    upvoted: Boolean,
    downvoted: Boolean

}, { timestamps: true });

const postData = mongoose.model('Post', postSchema);
module.exports = postData;

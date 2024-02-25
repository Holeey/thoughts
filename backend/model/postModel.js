const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postTitle: String,
    postBody: String,
    upvote: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    }],
    upvoteValue: Number,
    downvote: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    }],
    downvoteValue: Number,
    upvotedBycurrentUser: Boolean,
    downvotedBycurrentUser: Boolean

}, { timestamps: true });

const postData = mongoose.model('Post', postSchema);
module.exports = postData;

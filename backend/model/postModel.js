const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postTitle: String,
    postBody: String,
    postImg: String,
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
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repost' }], 
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

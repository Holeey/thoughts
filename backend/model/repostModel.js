const mongoose = require('mongoose');

const repostSchema = new mongoose.Schema({
    originalPost: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post' // Reference the Post model
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference the User model
    },
    repostComment: String,
    upvote: [],
    upvoteValue: {
        type: Number,
        default: ""
    },
    downvote: [],
    downvoteValue: {
        type: Number,
        default: ""
    },
    type: {
        type: String,
        enum: ['Repost'],
        default: 'Repost'
    }
}, { timestamps: true });

const Repost = mongoose.model('Repost', repostSchema);
module.exports = Repost;

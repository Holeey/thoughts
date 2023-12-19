const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    verified: Boolean,
    password: String,
    image: String,
    nickname: String,
    bio: String,
    dob: String
}) 

const userData = mongoose.model('User', userSchema);
module.exports = userData
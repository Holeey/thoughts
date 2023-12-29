const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    verified_email: Boolean,
    password: String,
    profile_image: String,
    nick_name: String,
    bio: String,
    dob: String,
    gender: String
}) 

const userData = mongoose.model('User', userSchema);
module.exports = userData
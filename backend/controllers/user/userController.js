const bcrypt = require('bcryptjs');
const { generateToken }= require('../../middleware/authMiddleware.js')

const userModel = require('../../model/userModel.js');

exports.registerUser = async (req, res) => {
    try{
    const { name, email, password } = req.body

    if (!name || !email ||!password) {
        return res.status(400).json('Please fill in all fields')  
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword =  await bcrypt.hash(password, salt)

    const userExists = await userModel.findOne({ email })
    if (userExists) {
        return res.status(400).json('User already exist')
    }
     
    const user = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
    })

    if (user) {
        res.status(200).json({
            name: user.name,
            email: user.email,
            password: hashedPassword,
            token: generateToken(user._id)
        })
    }
    }catch(error) {
        console.error('registration error:', error)
        return res.status(500).json('Internal Server Error')
    }

}

exports.loginUser = async (req, res) => {
    try {
    const { email, password } = req.body 

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json('User not available!')
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json('Invalid password!')
    }
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user._id)
        })
    }catch(error) {
        console.error('Login error',error)
        return res.status(500).json('Internal Server Error')
    }

}

exports.userProfile = async (req, res) => {
    try {
    const {newName, newEmail, newPassword, profileImg, nickname, bio, dob } = req.body
    const { id } = req.params

    if (!id ) {
        return res.status(401).json('Not authorized')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword =  await bcrypt.hash(newPassword, salt)

    const user = await userModel.findByIdAndUpdate( id, 
    {name: newName, email: newEmail, password: hashedPassword, profileImg, nickname, bio, dob },
    {new: true});

    if (!user) {
        return res.status(401).json('User not found!')
    }

    res.status(200).json({ user });    

    }catch(error) {
        console.error('profile:', error)
        return res.status(500).json('Internal Server Error')
    }

}



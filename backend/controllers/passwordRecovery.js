const {sendEmail} = require('../middleware/authMiddleware.js')
const {generateToken }= require('../middleware/authMiddleware.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userModel = require('../model/userModel.js');

exports.passwordRecovery = async (req, res) => {
    try {
    const { email } = req.body

    const user = await userModel.findOne({email});

    if (!user) {
        return res.status(401).json({error: 'password user not found'})
    }
    const emailVerificationToken = generateToken(user._id);
    
    const emailSubject = 'Password Recovery'
    const emailLink = `http://localhost:5000/recovery?token=${emailVerificationToken}`
    const emailContent = `Click the link to recover password: ${emailLink}`

    const recipientEmail = user.email;

    sendEmail(recipientEmail, emailSubject, emailContent)

    res.status(201).json({
        message: 'Email sent',
        verificationLink: emailLink,
        user
    })
    
    }catch(error) {
        console.error('Error in sending password recovery email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.verifyPasswordToken = async (req, res) => {
    try {
        const { newPassword } = req.body
        const { token } = req.query

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET,)

        const userId = await userModel.findById({ _id: decodedToken.id })

        if (!userId) {
            return res.status(401).json('User cannot be verified!')
        }
        
        if (!newPassword) {
            return res.status(401).json({error: 'no new password'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword =  await bcrypt.hash(newPassword, salt)

        const updatedPassword = await userModel.findByIdAndUpdate(userId._id, { password: hashedPassword }, {new: true}); 
        
        res.status(201).json({
            message: 'password updated',
            password:  updatedPassword
        })

    } catch (error) {
        console.error('Unable to change password:', error)
        res.status(500).json({error:'Internal error'})
    }
}
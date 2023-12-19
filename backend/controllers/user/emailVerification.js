const jwt = require('jsonwebtoken');
const {sendEmail} = require('../../middleware/emailMiddleWare.js')
const {generateToken }= require('../../middleware/authMiddleware.js')

const userModel = require('../../model/userModel.js');

exports.sendEmailVerification = async (req, res) => {
    try {
    const { email } = req.body

    const newUser = await userModel.findOne({email});

    if (!newUser) {
        return res.status(401).json({error: 'newUser not found'})
    }
    const emailVerificationToken = generateToken(newUser.email);
    
    const emailSubject = 'Email verification'
    const emailLink = `http://localhost:5000/processEmail?token=${emailVerificationToken}`
    const emailContent = `Click the link to verify email: ${emailLink}`

    const recipientEmail = newUser.email;

    sendEmail(recipientEmail, emailSubject, emailContent)

    return res.status(201).json({
        message: 'Email sent',
        verificationLink: emailLink,
    })
    
    }catch(error) {
        console.error('Error in sending email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.verifyEmailToken = async (req, res) => {
    try {
    const { token } = req.query

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET,)

    const user = await userModel.findOne({ email: decodedToken.id })

    if (!user) {
        return res.status(401).json('user cannot be verified')
    }

   const verifiedUser = await userModel.findByIdAndUpdate(user._id, {verified: true}, {new: true})

    return res.status(201).json({
        message: 'user email verified',
        verifiedUser
    })        
    } catch (error) {
        console.error('Error in emailVerification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
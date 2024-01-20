const express = require('express');

router = express.Router()

const { registerUser, loginUser, userProfile, getUserData } = require('../controllers/user/userController.js');
const { sendEmailVerification, verifyEmailToken } = require('../controllers/user/emailVerification.js');
const { passwordRecovery, verifyPasswordToken } = require('../controllers/user/passwordRecovery.js')
const { protect } = require('../middleware/authMiddleware.js');

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/verifyEmail', sendEmailVerification)
router.post('/processEmail', verifyEmailToken)
router.post('/recoverPassword', passwordRecovery) 
router.post('/processPassword', verifyPasswordToken)
router.put('/profile/:id', protect, userProfile)
router.get('/userData/:id', protect, getUserData)

module.exports = router
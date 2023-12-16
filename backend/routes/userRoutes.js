const express = require('express');

router = express.Router()

const { registerUser, loginUser, userProfile } = require('../controllers/user/userController.js');
const { sendEmailVerification, verifyEmailToken } = require('../controllers/user/emailVerification.js');
const { passwordRecovery, verifyPasswordToken } = require('../controllers/user/passwordRecovery.js')
const { protect } = require('../middleware/authMiddleware.js');

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/verifyEmail', sendEmailVerification)
router.get('/processEmail', verifyEmailToken)
router.post('/recoverPassword', passwordRecovery) 
router.get('/processPassword', verifyPasswordToken)
router.put('/profile/:id', protect, userProfile)

module.exports = router
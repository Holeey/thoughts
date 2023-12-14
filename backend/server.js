const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const { registerUser, loginUser, userProfile } = require('./controllers/userController.js');
const { sendEmailVerification, verifyEmailToken } = require('./controllers/emailVerification.js');
const { passwordRecovery, verifyPasswordToken } = require('./controllers/passwordRecovery.js')
const { protect } = require('./middleware/authMiddleware.js');
app = express()

app.use(cors());
app.use(express.urlencoded({extended: true}));

dotenv.config()
connectDB()

app.post('/register', registerUser)
app.post('/login', loginUser)
app.post('/verifyEmail', sendEmailVerification)
app.get('/processEmail', verifyEmailToken)
app.post('/recoverPassword', passwordRecovery)
app.get('/processPassword', verifyPasswordToken)
app.put('/profile/:id', protect, userProfile)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

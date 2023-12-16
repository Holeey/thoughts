const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    debug: true,
    auth: {
        user: 'odohizuchukwusamuel@gmail.com',
        pass: 'vcdl vpgu zrug pvqe'
    }
})

exports.sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: 'odohizuchukwusamuel@gmail.com',
            to,
            subject,
            text
        }
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    }catch(error) {
        console.error('sendEmail error:', error)
    }
}


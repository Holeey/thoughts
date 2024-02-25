const jwt = require('jsonwebtoken');

const userModel = require('../model/userModel.js');

exports.generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    })
}

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization 
        && req.headers.authorization.startsWith('Bearer')) {
        try {
        //Get token from request header
        token = req.headers.authorization.split(' ')[1]
        // verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        // Get userId from token
        req.user = await userModel.findById(decodedToken.id).select('-password')
        // Go to the next middlewear
        next();

        } catch(error) {
            console.error(error)
            if (error.name === "JsonWebTokenError") {
               return res.status(401).json('Invalid token')
            }else if (error.name === "TokenExpiredError") {
               return res.status(401).json('Token expired')
            } else {
              return res.status(401).json('Not authorized')
            }
        }
    }
    if (!token) {
        res.status(401).json('No token provided error')
    }
}


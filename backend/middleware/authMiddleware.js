const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, no token yet' });
    }
    const Token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(Token);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) return res.status(401).json({ message: 'Not authorized, user not found' });
        next();
    }
    catch (e) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }

}

module.exports = protect;
module.exports.verifyToken = verifyToken;

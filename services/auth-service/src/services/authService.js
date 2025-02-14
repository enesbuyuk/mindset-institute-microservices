const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    );
};

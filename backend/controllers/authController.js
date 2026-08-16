const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');
//register
 const register = async (req,res)=> {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'an account already exists with your email' });

        const user = await User.create({ username: username, email: email, password: password });
        const token = generateToken(user._id);
        res.status(201).json({ message: 'User registered', _id: user._id, username: user.username, email: user.email, token: token });
    }
    catch (e) {
        if (e.code === 11000) return res.status(409).json({ message: 'Username or email already taken, try another one!' });
        res.status(500).json({message: 'Server error'});
    }
}

const login = async (req, res) => {

    try {
        const {  email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: ' Email and password are required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id);
        res.status(200).json(
            { _id: user._id,
              username: user.username,
              email: user.email,
              token
             });
    }

    catch (e) {
        res.status(500).json({ message: 'Invalid Id format' });
    }
}

module.exports = {register, login};

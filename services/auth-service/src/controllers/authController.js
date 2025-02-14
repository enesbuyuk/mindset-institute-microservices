const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { generateToken } = require("../services/authService");

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, role, phoneNumber, birthDate, profilePicture, address } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
            phoneNumber: phoneNumber || null,
            birthDate: birthDate || null,
            profilePicture: profilePicture || null,
            address: address || null
        });

        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                phoneNumber: newUser.phoneNumber,
                birthDate: newUser.birthDate,
                profilePicture: newUser.profilePicture,
                address: newUser.address,
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful!',
            token,
        });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};

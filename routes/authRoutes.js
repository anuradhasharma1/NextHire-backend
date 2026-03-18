const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



//Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        //check if user exist alr
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email already registered!" });
        }
        //encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Save new User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({ message: "Registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong!", error: err.message });
    }
});

//Login

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password!" });
        }

        // create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong!", error: err.message });
    }
});

module.exports = router;

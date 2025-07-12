const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
    });
    
    // Generate token
    generateToken(user._id);

    res.status(201).json({ message: "User registered successfully", user });
});

exports.login = asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new ApiError("Invalid email or password", 401));
        }
    
        delete user._doc.password; // Remove password from response
    
        // Generate token
        const token = generateToken(user._id);
    
        res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 2 * 24 * 60 * 60 * 1000,
        });
    
        res.status(200).json({
        status: "success",
        user,
        });
    });
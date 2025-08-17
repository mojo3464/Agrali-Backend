const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token
  generateToken(user._id);

  res
    .status(201)
    .json({ status: "success", message: "User registered successfully", user });
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
    message: "User logged in successfully",
    user,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1 - Get token from cookies instead of headers
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2 - Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3 - Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user that belong to this token no longer exist", 401)
    );
  }

  // 4 - Check if user changed password after token was issued
  if (currentUser.passwordChangedAt) {
    const passChangeTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passChangeTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- check user role
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("You have no permission to perform this action", 403)
      );

    next();
  });

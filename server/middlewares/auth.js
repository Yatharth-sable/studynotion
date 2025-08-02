const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    // if token is missing return
    if (!token) {
      res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
      }
     catch (err) {
      // verification - issue
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isstudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for the student only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User cannot be verified for Instructor try again later ",
    });
  }
};

// isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "this is protected route for the Instructor only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User cannot be verified try again later for Instructor",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    console.log(req.user.accountType)
    if (req.user.accountType !== "Admin") {
      return res.status(400).json({
        success: false,
        message: "this is protected route for the Admin only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User cannot be verified try again later for Admin",
    });
  }
};

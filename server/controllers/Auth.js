const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenrator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile")

require("dotenv").config();

// send otp
exports.sendOTP = async (req, res) => {
  try {
    // fetch from the email body
    const { email } = req.body;

    // check if user already exists
    const checkUserPresent = await User.findOne({ email });

    // if user is already exists then return response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already register",
      });
    }

    // genrate otp
    var otp = otpGenrator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Otp genrated", otp);

    // check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    // jb tk unique otp nhi milta tb tk yaha check krege
    while (result) {
      otp = otpGenrator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    // create an entry in db
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return response successfully
    res.status(200).json({
      success: true,
      message: "Otp send successfully",
      otp,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// signUp

exports.signUp = async (req, res) => {
  try {
    // data fetch from the req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
      contactNumber,
    } = req.body;
    // validate karo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "SignUp:All fields are required ",
      });
    }
    
    // 2 password match kro
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Password does not match",
      });
    }

    // check user already exist or not
    const extingishUser = await User.findOne({ email });
    if (extingishUser) {
      return res.status(403).json({
        success: false,
        message: "User is already register",
      });
    }
    // find most recent otp stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    // validate otp
    if (recentOtp.length == 0) {
      // otp not found
      return res.status(403).json({
        success: false,
        message: "SignUp:Otp not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      // Invalid Otp
      return res.status(403).json({
        success: false,
        message: "Otp does not matched",
      });
    }
    // hash password
    const hashedPassord = await bcrypt.hash(password, 10);

    // entry create in db
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassord,
      accountType,
      additonalDetails: profileDetails._id,
      imageUrl: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`

    });
    // return res
    return res.status(200).json({
      success: true,
      message: "User is registred successfully",
      user:user
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      success: false,
      message: "Signup: User cannot be registered Please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    // get the data form the req body
    const { email, password } = req.body;

    // validate the data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Enter the fields Properly",
      });
    }
    // check if the user already exists
    const user = await User.findOne({ email }).populate("additonalDetails"); // why populate
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User cannot be registered Please try again",
      });
    }

    // check the passowrd , genrate the jwt
    if (await bcrypt.compare(password, user.password)) {
      // could be error for user

      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn : "2h",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: "Logged in successfully",
        });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password is incorrect in login ",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      success: false,
      message: "Login failure please try again later",
    });
  }
}

// changePassword
exports.changePassword = async (req, res) => {
  try {
    
    // Get user data from req.user
		const userDetails = await User.findById(req.user.id);

    // fetch the data from the user
    const { oldPassword, newPassword, confirmPassword, email } = req.body;

    // check the all the fileds are not empty
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Complete all the fields for Password change",
      });
    }

    // validation
    if (newPassword !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: " error in changepassword : Password not matched ",
      });
    }

    // check if oldpassword == password is same in db
    if (!(await bcrypt.compare(oldPassword, userDetails.password))) {
      return res.status(403).json({
        success: false,
        message: "Error:Old password and new Password does not match",
      });
    }

    // hash the newPassword
    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    // update the password
    const updatedUserDetails = await User.findOneAndUpdate(
      req.user.id,
      {
        password: encryptedPassword,
      },
      { new: true }
    );

    // send the confirmation email
   try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}
    // Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });

  } catch (err) {
    console.log(err);
    res.status(403).json({
      success: false,
      message: "Password Change Unsuccessfull",
    });
  }
};

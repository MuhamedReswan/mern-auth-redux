import asyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, matchPassword } from "../utils/passwordModify.js";

// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body", req.body);

  const user = await User.findOne({ email });
  console.log("validatePassword user", user);

  if (user) {
    console.log("within if user");
    const isPasswordCorrect = await matchPassword(password, user.password);
    console.log("isPasswordCorrect", isPasswordCorrect);

    if (isPasswordCorrect) {
      console.log("wiht success authentication");
      generateToken(res, user._id,'userJwt');
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error("Incorrect password");
    }
  } else {
    res.status(401);
    throw new Error("No user found with the provided email");
  }
});


// @desc Register a new user
// route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please fill all fields");
  }

  const existUser = await User.findOne({ email });
  console.log("existUser", existUser);
  if (existUser) {
    res.status(400);
    throw new Error("User Already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    generateToken(res, user._id,'userJwt');
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// @desc Logout user
// route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  console.log("logout invoked");
  res.cookie("userJwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});


// @desc Get User Profile
// route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  res.status(200).json({ user });
});


// @desc Update User Profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password) {
      const updatedHashPassword = await hashPassword(req.body.password);
      user.password = updatedHashPassword;
    }

    const updatedUser = await user.save();
    console.log("updated user=", updatedUser);
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage:updatedUser.profileImage
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  // res.status(200).json({ message: "Update user Profile" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

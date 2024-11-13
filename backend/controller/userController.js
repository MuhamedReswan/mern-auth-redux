import asyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import { hashPassword, matchPassword } from "../utils/passwordModify.js";

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
      generateToken(res, user._id);
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
    generateToken(res, user._id);
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

const logoutUser = asyncHandler(async (req, res) => {
  console.log("logout invoked");
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "User Profile" });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Update user Profile" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

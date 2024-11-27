import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../model/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log("req.cookies",req.cookies)

  token = req.cookies.userJwt;
  console.log("token",token)

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetches the user by ID, removing the password field from the result
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});



export {
    protect
}
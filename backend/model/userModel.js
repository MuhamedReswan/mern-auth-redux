import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isAdmin:{
      type:Boolean,
      default:false
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage:{
      type:String,
      default:'null'
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);


export default User;

import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      String,
      required: true,
    },
    email: {
      String,
      required: true,
      unique: true,
    },
    password: {
      String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

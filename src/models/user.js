const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
    },
    photoUrl: {
      type: String,
      default: "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png",
    },
    gender: {
      type: String,
    },
    about: {
      type: String,
      default: "this is default value",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

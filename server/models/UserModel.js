// import mongoose from "mongoose";
const mongoose = require("mongoose");
const randomstring = require("randomstring");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  refID: {
    type: String,
    unique: true,
    default: () =>
      randomstring.generate({
        length: 5,
        charset: "alphabetic",
      }),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

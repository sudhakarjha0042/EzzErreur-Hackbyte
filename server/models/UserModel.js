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
  Dob: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String, // for special characters
    required: true,
    unique: true,
  },
  interests: [
    // verify this field
    {
      type: String,
    },
  ],
  cause: [
    {
      type: String,
    },
  ],
  platform: [
    {
      type: String,
    },
  ],

  description: {
    type: String,
    required: false,
  },
  // payment gateway fields
  stripeId: {
    type: String,
    unique: true,
    default: null, // Default to null until a Stripe ID is assigned
  },
  isPaid: {
    type: Boolean,
    default: false,
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

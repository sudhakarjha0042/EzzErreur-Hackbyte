const mongoose = require("mongoose");
const User = require("./UserModel");
// followers and the following field will be removed soon
const profileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  profilepic: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  private: {
    type: Boolean,
    default: false, // profiles can be private or public
  },
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // for  storing the posts posted by the user
  },

  followersCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  totalPosts: {
    type: Number,
    default: 0,
  },
  communityGroups: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
      },
    ],

    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Setting field is remaining.. soon to be updated
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;

// ------------------------------------------------------
// for the default array , alternative method can be
// default: function () {
//   return [];
// },

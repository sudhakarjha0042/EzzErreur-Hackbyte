const mongoose = require("mongoose");

const postLike = new mongoose.Schema({
  // User who liked the post
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  // Post that was liked
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  // Timestamp of when the like was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create an index for efficient querying based on post and user
postLike.index({ post: 1, user: 1 });

module.exports = mongoose.model("Like", postLike);

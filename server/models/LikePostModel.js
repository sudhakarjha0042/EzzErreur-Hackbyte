const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  codeSnipetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodeSnipet",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;

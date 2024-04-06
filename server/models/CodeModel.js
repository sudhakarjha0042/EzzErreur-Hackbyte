const mongoose = require("mongoose");
const Profile = require("./ProfileModel");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  codeSnipet: {
    type: String,
    required: true,
  },
  // likes: {
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  //   default: [],
  // },

  likeNumber: {
    type: Number,
    default: 0,
  },
  postCount: {
    type: Number,
    required: false,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cursor: {
    type: Number,
  },
});

postSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew || !doc.cursor) {
    // Add this condition
    const counterName = "post_cursor";
    const counterDoc = await Counter.findByIdAndUpdate(
      counterName,
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    doc.cursor = counterDoc.sequence_value;
  }
  next();
});

postSchema.index({ createdBy: 1, type: 1 });
postSchema.index({ communityId: 1 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

const mongoose = require("mongoose");
const Like = require("./LikePostModel");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const codeSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  codeSnipet: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }], // Fix this line
  likeNumber: { type: Number, default: 0 },
  postCount: { type: Number, required: false, default: 0 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  cursor: { type: Number },
});

codeSchema.pre("save", async function (next) {
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

codeSchema.index({ createdBy: 1, type: 1 });
codeSchema.index({ communityId: 1 });

const CodeSnipet = mongoose.model("CodeSnipet", codeSchema);

module.exports = CodeSnipet;

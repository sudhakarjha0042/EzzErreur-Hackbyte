// const LikePostmodel = require("../models/LikePostModel");
const moment = require("moment");
const LikePostModel = require("../models/LikePostModel");
const Like = require("../models/LikePostModel");
const { default: mongoose } = require("mongoose");
const CodeSnipet = require("../models/CodeModel");

const createCodeSnippet = async (req, res) => {
  console.log("create post controller");
  const { description, title, codeSnipet, tags } = req.body;
  const userId = req.userId; // Assuming you have the userId attached to the request object after token verification
  console.log("post controller function", userId);

  try {
    // Create a new post instance associated with the user's profile
    const newCodeSnipet = new CodeSnipet({
      title,
      description,
      tags,
      codeSnipet,
      createdBy: userId, // Reference to the user's profile
    });

    // Save the post to the database
    await newCodeSnipet.save();

    res
      .status(201)
      .json({ message: "Code Added successfully", post: newCodeSnipet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const optimiseCodeSnippet = async (req, res) => {};
const cleanCodeSnippet = async (req, res) => {};

const getallCode = async (req, res) => {
  try {
    const posts = await CodeSnipet.find().populate({
      path: "createdBy",
      populate: { path: "user" }, // Populate the user field of the profile
    });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const userId = req.userId;
  const { postId } = req.body;

  try {
    // Find the post
    const post = await Postmodel.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // find the profile
    const profile = await Profilemodel.findOne({ user: userId });

    // Check if the user's profile exists
    if (!profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Check if the user is the owner of the post
    if (post.createdBy.toString() !== profile._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    // Remove the post
    console.log("post is ", post);
    await Postmodel.deleteOne({ _id: postId });

    // Update the user's profile to remove the post reference
    await Profilemodel.findByIdAndUpdate(
      userId,
      { $pull: { posts: postId } },
      { new: true }
    );

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUserCode = async (req, res) => {
  const userId = req.userId;

  try {
    const codes = await CodeSnipet.find({ createdBy: userId }).populate({
      path: "createdBy",
      populate: { path: "user" }, // Populate the user field of the profile
    });
    res.json({ codes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error: " + error });
  }
};

const getPostbyID = async (req, res) => {
  const { postId } = req.query;
  console.log("post id is", postId);
  try {
    const posts = await CodeSnipet.findById(postId).populate({
      path: "createdBy",
      populate: { path: "user" }, // Populate the user field of the profile
    });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const likeCodeSnipet = async (req, res) => {
  try {
    // Extract userId and codeSnipetId from request
    const userId = req.userId;
    const { codeSnipetId } = req.body;

    // Check if user already liked/unliked the code snippet and perform the appropriate action
    const existingLike = await Like.findOne({ userId, codeSnipetId });

    if (existingLike) {
      // User is unliking the code snippet
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await Like.deleteOne({ _id: existingLike._id }, { session }); // Delete the existing like
        await CodeSnipet.findByIdAndUpdate(
          codeSnipetId,
          { $inc: { likeNumber: -1 } }, // Decrement likeNumber
          { new: true, session }
        );
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }

      return res.json({ message: "Code snippet unliked successfully" });
    } else {
      // User is liking the code snippet
      const newLike = new Like({ userId, codeSnipetId });
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await newLike.save({ session });
        const savedCodeSnipet = await CodeSnipet.findByIdAndUpdate(
          codeSnipetId,
          { $inc: { likeNumber: 1 }, $push: { likes: newLike._id } }, // Increment likeNumber and push new like ID to likes array
          { new: true, session }
        );
        await session.commitTransaction();
        res.json({
          likeNumber: savedCodeSnipet.likeNumber,
          message: "Code snippet liked successfully",
          codeSnipet: savedCodeSnipet,
        });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCodeSnippet,
  deletePost,
  likeCodeSnipet,
  getPostbyID,
  cleanCodeSnippet,
  optimiseCodeSnippet,
  getallCode,
  getAllUserCode,
};

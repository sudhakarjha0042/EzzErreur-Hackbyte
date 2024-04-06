const Postmodel = require("../models/CodeModel");
const Profilemodel = require("../models/ProfileModel");
// const LikePostmodel = require("../models/LikePostModel");
const moment = require("moment");
const LikePostModel = require("../models/LikePostModel");

const createCodeSnippet = async (req, res) => {
  console.log("create post controller");
  const { description, title, codeSnipet, tags } = req.body;
  const userId = req.userId; // Assuming you have the userId attached to the request object after token verification
  console.log("post controller function", userId);

  try {
    // Find the profile of the user who created the post
    const userProfile = await Profilemodel.findOne({ user: userId });

    console.log("profile id is", userProfile);

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Check the user's posting history within the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const userPostCount = await Postmodel.countDocuments({
      createdBy: userProfile._id,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    const allposts = await Postmodel.find({
      createdBy: userProfile._id,
      createdAt: { $gte: twentyFourHoursAgo },
    });
    console.log("all posts", allposts);

    console.log("post count is", userPostCount);

    if (userPostCount >= 3) {
      return res
        .status(400)
        .json({ error: "Maximum limit of 3 posts reached in 24 hours" });
    }

    // Create a new post instance associated with the user's profile
    const newCodeSnipet = new Postmodel({
      title,
      description,
      tags,
      codeSnipet,
      createdBy: userProfile._id, // Reference to the user's profile
    });

    // Save the post to the database
    await newCodeSnipet.save();

    // Update the user's profile to include the newly created post
    await Profilemodel.findByIdAndUpdate(
      userProfile._id,
      { $push: { posts: newCodeSnipet._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Video posted successfully", post: newCodeSnipet });
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

const getPostbyID = async (req, res) => {
  const { postId } = req.query;
  console.log("post id is", postId);
  try {
    const posts = await Postmodel.findById(postId).populate({
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
    // Extract userId and postId from request
    const userId = req.userId;
    const { postId } = req.body;
    const profile = await Profilemodel.findOne({ user: userId });

    // Check if user already liked/unliked the post and perform the appropriate action
    const existingLike = await LikePostModel.findOne({
      user: profile._id,
      post: postId,
    });

    if (existingLike) {
      // User is unliking the post
      await LikePostModel.db.transaction(async () => {
        await LikePostModel.deleteOne({ _id: existingLike._id }); // Delete the existing like
        await Postmodel.findByIdAndUpdate(
          postId,
          { $inc: { likeNumber: -1 } }, // Decrement likeNumber
          { new: true }
        );
      });

      return res.json({ message: "Post unliked successfully" });
    } else {
      // User is liking the post
      const newLike = new LikePostModel({
        user: profile._id,
        post: postId,
      });

      const savedLike = await LikePostModel.db.transaction(async () => {
        await newLike.save();
        const savedPost = await Postmodel.findByIdAndUpdate(
          postId,
          { $inc: { likeNumber: 1 } }, // Increment likeNumber
          { new: true }
        );
        return savedPost; // Return the updated post document
      });

      res.json({
        likeNumber: savedLike.likeNumber,
        message: "Post liked successfully",
        post: savedLike,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createCodeSnippet, deletePost, likeCodeSnipet, getPostbyID };

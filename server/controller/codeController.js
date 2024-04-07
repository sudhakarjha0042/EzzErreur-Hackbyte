// const LikePostmodel = require("../models/LikePostModel");
const moment = require("moment");
const LikePostModel = require("../models/LikePostModel");
const Like = require("../models/LikePostModel");
const { default: mongoose } = require("mongoose");
const CodeSnipet = require("../models/CodeModel");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

const optimiseCodeSnippet = async (req, res) => {
  const unOptimised = req.body.unOptimised;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to optimise my code by doing good practices, adding useful comments and make code more readable. you just reply with the new code and no other comments.",
        },
        { role: "user", content: `optimise this code for me : ${unOptimised}` },
      ],
      model: "gpt-3.5-turbo-0125",
    });

    const optimisedCode = completion.choices[0].message.content;
    res.json({ optimisedCode: optimisedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const cleanCodeSnippet = async (req, res) => {
  const uncleanCode = req.body.uncleanCode;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to clean my code by removing comments, useless code and make code more readable. also remove statements that we wouldnt like in production - like console.log :",
        },
        { role: "user", content: `clean this code for me : ${uncleanCode}` },
      ],
      model: "gpt-3.5-turbo-0125",
    });

    const cleanedCode = completion.choices[0].message.content;
    res.json({ cleanedCode: cleanedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const gitAnalyze = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;

  const patchfiles = req.body.patchfiles;

  try {
    const prompt = `
      
      Analyse this code for me:
      Title: ${title}
      Description: ${description}
      Patch Files: ${patchfiles}

      Understand this pull request and the title and well as the decription and check how much it matches the title and the desciption , using that give me a percentage of whats the possiblity it will work out when we mearge it.
      You have to send me a json response only which will look like this,

      {
      "Explaination" :" [this should not be more than 100 words] " ,
      "percentage": "[This shoudl be very acurate ]"
      }

      make sure you only send back the JSON response noting else , or I will die.
`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to analyse my code by giving me a summary of the code changes, the impact of the changes and the potential bugs in the code. you just reply with the analysis and no other comments.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo-0125",
    });

    const result = completion.choices[0].message.content;
    res.json({ result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
  gitAnalyze,
};

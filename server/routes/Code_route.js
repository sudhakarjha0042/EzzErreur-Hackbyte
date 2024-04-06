const express = require("express");

const router = express.Router();
const CodeModel = require("../models/CodeModel");
const {
  createCodeSnippet,
  deletePost,
  likeCodeSnipet,
  getPostbyID,
} = require("../controller/codeController");
const { verifyUser } = require("../middlewares/auth_middleware");

//public routes
router.get("/getpostbyID", getPostbyID);

//private routes
router.post("/postCode", verifyUser, createCodeSnippet);
router.post("/likeCodeSnipet", verifyUser, likeCodeSnipet);
router.delete("/deletepost", verifyUser, deletePost);

module.exports = router;

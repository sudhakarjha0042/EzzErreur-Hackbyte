const express = require("express");
const PostModel = require("../models/CodeModel");
const {
  recommendedPostsHome,
  getRecommendedUsersExplore,
  getRecommendedCommunities,
  getRecommUsersOnboard,
} = require("../controller/exploreController");
const { verifyUser } = require("../middlewares/auth_middleware");
const router = express.Router();

router.get("/getrecomusersonboard", verifyUser, getRecommUsersOnboard);
router.get(
  "/getrecommendedusersexplore",
  verifyUser,
  getRecommendedUsersExplore
);
router.get("/getpostsHome", verifyUser, recommendedPostsHome);
router.get("/getrecommededComm", verifyUser, getRecommendedCommunities);
module.exports = router;

const User = require("../models/UserModel");
const Profile = require("../models/ProfileModel");
const Post = require("../models/CodeModel");
const Like = require("../models/LikePostModel");
// const recommendedPostsHome = async (req, res) => {
//   const cursorString = req.query.cursor; // Cursor for pagination
//   const limit = 5; // Number of posts per page

//   try {
//     let queryConditions = {};

//     if (cursorString) {
//       const cursorId = parseInt(cursorString);
//       queryConditions = { cursor: { $lte: cursorId } };
//     }

//     // Fetch posts based on query conditions
//     const recommendations = await Post.find(queryConditions)
//       .sort({ cursor: -1 }) // Sort by cursor in descending order
//       .limit(limit);

//     // Extract cursor for next page
//     const nextCursor =
//       recommendations.length > 0
//         ? recommendations[recommendations.length - 1].cursor
//         : null;

//     return res.status(200).json({ recommendations, nextCursor });
//   } catch (error) {
//     console.error("Error fetching relevant posts:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
const getRecommUsersOnboard = async (req, res) => {
  const pageSize = 10;

  const pageNumber = req.query.pageNumber || 1;
  console.log("page is ", pageNumber);
  try {
    const paidUserIds = await User.find({ isPaid: true }, "_id")
      .sort({ createdAt: -1 })
      .lean();
    const unpaidUserIds = await User.find({ isPaid: false }, "_id")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = [...paidUserIds, ...unpaidUserIds].map((user) => user._id);
    console.log("length of user ids is ", userIds.length);
    const uniqueUserIds = [...new Set(userIds)];
    console.log("length of unique user ids is ", uniqueUserIds.length);
    // console.log("unique user ids are ", uniqueUserIds);
    const profiles = await Profile.find({ user: { $in: uniqueUserIds } })
      .populate("user")
      .sort({ createdAt: -1 })
      .lean();
    console.log("length of profiles is ", profiles.length);

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedProfiles = profiles.slice(startIndex, endIndex);
    console.log("length of paged profiles is ", pagedProfiles.length);
    return res.status(200).json(pagedProfiles);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const recommendedPostsHome = async (req, res) => {};

// function for getting the recommended users on the explore page
const getRecommendedUsersExplore = async (req, res) => {};

// recommendation of user groups on explore and groups page
const getRecommendedCommunities = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await Profile.findOne({ user: userId });
    console.log("profile is ", profile);

    // Get the list of community IDs the user is already part of
    const userCommunityIds = profile.communityGroups.map((group) =>
      group.toString()
    );
    console.log("userCommunityIds is ", userCommunityIds);

    // Extract page number from query parameter, default to 1 if not provided
    const page = req.query.page ? parseInt(req.query.page) : 1;
    console.log("page is ", page);

    // Number of communities to display per page
    const perPage = 15;

    // Calculate the skip value based on the requested page number
    const skip = (page - 1) * perPage;

    // Query the communities, sorting by creation date in descending order, excluding the communities the user is already part of
    const communities = await Community.find({
      _id: { $nin: userCommunityIds },
    })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    console.log("length of the community is ", communities.length);
    res.json({ communities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getRecommUsersOnboard,
  recommendedPostsHome,
  getRecommendedUsersExplore,
  getRecommendedCommunities,
};

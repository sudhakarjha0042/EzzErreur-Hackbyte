const Profile = require("../models/ProfileModel");
const MembershipRequest = require("../models/RequestCommunityModel");
const checkAdminorModerator = async (req, res, next) => {
  try {
    const { userId } = req;
    const profile = await Profile.findOne({ user: userId });
    const { communityId } = req.body;

    // Fetch the community from the database
    const community = await Community.findById(communityId);

    // Check if the community exists
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the user making the request is the admin of the community
    if (String(community.admin) === profile._id.toString()) {
      // If the user is the admin, allow the request
      return next();
    }

    // Check if the user making the request is a moderator of the community
    if (community.moderators.includes(profile._id.toString())) {
      // If the user is a moderator, allow the request
      return next();
    }

    // If the user is neither the admin nor a moderator, deny the request
    return res
      .status(403)
      .json({ message: "Only admin or moderator can perform this action" });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
};

// const isCommunityMember = async (req, res, next) => {
//   try {
//     const { communityId, userId } = req.body; // Assuming your route extracts community ID from the URL

//     // Validate community ID and user ID
//     if (!communityId || !userId) {
//       return res.status(400).json({ error: "Missing community ID or user ID" });
//     }

//     // Check if user is a member of the community
//     const isMember = await Community.findOne({
//       _id: communityId,
//       allMembers: { $in: [userId] },
//     });

//     if (!isMember) {
//       return res
//         .status(403)
//         .json({ error: "You are not a member of this community" });
//     }

//     // User is a member, proceed with the request
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const isCommunityMember = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { communityId } = req.body;
    console.log("userId and community Id is", userId, communityId);

    if (!communityId || !userId) {
      return res.status(400).json({ error: "Missing community ID or user ID" });
    }

    // Check if the user's profile is associated with the specified community
    const userProfile = await Profile.findOne({
      user: userId,
      communityGroups: communityId,
    });

    if (!userProfile) {
      return res
        .status(403)
        .json({ error: "You are not a member of this community" });
    }

    // User is a member, proceed with the request
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  checkAdminorModerator,
  isCommunityMember,
};

const User = require("../models/User");
const Match = require("../models/Match");
const PendingMatch = require("../models/PendingMatch");
const asyncHandler = require("express-async-handler");

// Get the newsfeed based on the skills the user wants to learn
exports.getNewsfeed = asyncHandler(async (req, res, next) => {
   const userId = req.userId;

   // Get the current user
   const user = await User.findById(userId);
   if (!user) {
      throw new Error(`User not found with id ${userId}`, 404);
   }

   // Get the current user's want2learn skills
   const userWant2Learn = user.want2learn;

   // Find users who can teach at least one of the skills the current user wants to learn
   const potentialMatches = await User.find({
      _id: { $ne: userId },
      want2teach: { $in: userWant2Learn },
   });

   if (potentialMatches.length === 0) {
      return res.status(200).json({
         success: true,
         message:
            "No users found in the newsfeed based on your learning interests.",
         data: [],
      });
   }

   res.status(200).json({
      success: true,
      message: "Newsfeed generated based on your learning interests.",
      data: potentialMatches,
   });
});

// Handle user choice (yes/no) for match
exports.handleChoice = asyncHandler(async (req, res, next) => {
   const userId = req.userId;
   const { targetUserId, choice } = req.body;

   if (choice !== "yes" && choice !== "no") {
      throw new Error("Choice must be 'yes' or 'no'");
   }

   // Find the current user and target user
   const user = await User.findById(userId);
   const targetUser = await User.findById(targetUserId);
   if (!user || !targetUser) {
      throw new Error("User or Target User not found");
   }

   // Check if a pending match exists
   let pendingMatch = await PendingMatch.findOne({
      $or: [
         { user1: userId, user2: targetUserId },
         { user1: targetUserId, user2: userId },
      ],
   });

   if (!pendingMatch) {
      // If no pending match, create one
      pendingMatch = new PendingMatch({
         user1: userId,
         user2: targetUserId,
         user1Choice: choice === "yes" ? "yes" : "no",
         user2Choice: "no", // Default is no for the target user
      });
      await pendingMatch.save();
   } else {
      // Update the choice of the current user
      if (pendingMatch.user1.toString() === userId) {
         pendingMatch.user1Choice = choice;
      } else {
         pendingMatch.user2Choice = choice;
      }
      await pendingMatch.save();
   }

   // If both users have chosen "yes", create a match
   if (
      pendingMatch.user1Choice === "yes" &&
      pendingMatch.user2Choice === "yes"
   ) {
      const match = new Match({
         user1: userId,
         user2: targetUserId,
      });
      await match.save();

      // Remove the pending match
      await PendingMatch.deleteOne({ _id: pendingMatch._id });

      return res.status(200).json({
         success: true,
         message: "Match created successfully!",
         data: match,
      });
   }

   res.status(200).json({
      success: true,
      message:
         "Your choice has been recorded. Awaiting response from the other user.",
   });
});

// Get all matches for the current user
exports.getUserMatches = asyncHandler(async (req, res, next) => {
   const { userId } = req;

   const matches = await Match.find({
      $or: [{ user1: userId }, { user2: userId }],
   })
      .populate("user1", "username email")
      .populate("user2", "username email");

   if (!matches || matches.length === 0) {
      return res.status(200).json({
         success: true,
         message: "No matches found.",
         data: [],
      });
   }

   res.status(200).json({
      success: true,
      data: matches,
   });
});

// Respond to a match choice (yes/no)
exports.respondToMatchRequest = asyncHandler(async (req, res, next) => {
   const { userId } = req;
   const { targetUserId, response } = req.body;

   if (!["yes", "no"].includes(response)) {
      throw new Error("Invalid response. Must be 'yes' or 'no'", 400);
   }

   const pendingMatch = await PendingMatch.findOne({
      $or: [
         { user1: userId, user2: targetUserId },
         { user1: targetUserId, user2: userId },
      ],
   });

   if (!pendingMatch) {
      throw new Error("No pending match found", 404);
   }

   // Update the choice based on the current user
   if (pendingMatch.user1.toString() === userId.toString()) {
      pendingMatch.user1Choice = response;
   } else {
      pendingMatch.user2Choice = response;
   }

   await pendingMatch.save();

   // If both users have chosen "yes", create a match
   if (
      pendingMatch.user1Choice === "yes" &&
      pendingMatch.user2Choice === "yes"
   ) {
      const match = new Match({
         user1: userId,
         user2: targetUserId,
      });
      await match.save();

      // Remove the pending match
      await PendingMatch.deleteOne({ _id: pendingMatch._id });

      return res.status(200).json({
         success: true,
         message: "Match created successfully!",
         data: match,
      });
   }

   res.status(200).json({
      success: true,
      message: "Match request response recorded.",
   });
});

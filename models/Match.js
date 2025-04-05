const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
   user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active", // The match is active until further actions (archiving, etc.)
   },
});

module.exports = mongoose.model("Match", MatchSchema);

const mongoose = require("mongoose");

const PendingMatchSchema = new mongoose.Schema({
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
   user1Choice: {
      type: String,
      enum: ["yes", "no"],
      default: "no", // Default is "no" until user selects
   },
   user2Choice: {
      type: String,
      enum: ["yes", "no"],
      default: "no", // Default is "no" until user selects
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

PendingMatchSchema.index({ user1: 1, user2: 1 }, { unique: true }); // Ensure that the match request between two users is unique

module.exports = mongoose.model("PendingMatch", PendingMatchSchema);

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
});

module.exports = mongoose.model("PendingMatch", PendingMatchSchema);

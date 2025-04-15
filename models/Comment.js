const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   },
   post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
   },
   content: {
      type: String,
      default: "",
   },
   reaction: {
      type: String,
      enum: ["liked", "disliked", "nothing"],
      default: "nothing",
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
});

module.exports = mongoose.model("Post", PostSchema);

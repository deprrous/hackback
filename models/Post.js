const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
   title: {
      type: String,
      required: [true, "Хэрэглэгчийн нэрийг оруулна уу"],
   },
   category: {
      type: String,
      required: [true, "You must enter user email"],
      enum: ["zar", "asuult", "fun"],
   },
   user_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Comment model
      ref: "User",
   },
   group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
   },
   content: {
      type: String, // Content is a text (String)
      required: [true, "Content is required"], // Content is mandatory
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

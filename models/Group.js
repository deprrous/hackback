const mongoose = require("mongoose");
const GroupSchema = new mongoose.Schema({
   title: {
      type: String,
      required: [true, "Group name is required"],
      unique: true,
   },
   description: {
      type: String,
      required: [true, "Group description is required"],
   },
   users: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   ],
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model("Group", GroupSchema);

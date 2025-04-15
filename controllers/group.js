const Group = require("../models/Group");
const asyncHandler = require("express-async-handler");

exports.createGroup = asyncHandler(async (req, res, next) => {
   const { title, description } = req.body;

   const existingGroup = await Group.findOne({ title });
   if (existingGroup) {
      throw new Error("Group title already exists", 400);
   }

   const group = await Group.create({
      title,
      description,
   });

   res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
   });
});

exports.getGroups = asyncHandler(async (req, res, next) => {
   const groups = await Group.find();

   if (groups.length === 0) {
      return res.status(200).json({
         success: true,
         message: "No groups found",
         data: [],
      });
   }

   res.status(200).json({
      success: true,
      data: groups,
   });
});

exports.getGroup = asyncHandler(async (req, res, next) => {
   const group = await Group.findById(req.params.id);

   if (!group) {
      throw new Error(`Group not found with ID: ${req.params.id}`, 404);
   }

   res.status(200).json({
      success: true,
      group,
   });
});

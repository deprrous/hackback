const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

// Create a new post
exports.createPost = asyncHandler(async (req, res, next) => {
   const post = await Post.create(req.body);
   if (!post)
      throw new Error("Something went wrong while creating the post", 403);
   res.status(200).json({
      success: true,
      post,
   });
});

// Get all posts with sorting, selecting fields, and pagination
exports.getPosts = asyncHandler(async (req, res, next) => {
   const sort = req.query.sort || "-createdAt"; // Default to sorting by createdAt in descending order
   const select = req.query.select || ""; // Allow field selection via query
   const page = parseInt(req.query.page); // Default to page 1
   const limit = parseInt(req.query.limit); // Default to a limit of 2 posts per page

   ["sort", "select", "page", "limit"].forEach((el) => delete req.query[el]);

   const pagination = await paginate(Post, page, limit); // Use Post for pagination

   const posts = await Post.find(req.query, select)
      .populate({
         path: "user_id",
         select: "username ", // юуг авах гэж байна тэрийг бич
      })
      .sort(sort)
      .skip(pagination.start - 1)
      .limit(limit);

   res.status(200).json({
      success: true,
      total: posts.length,
      data: posts,
      pagination: pagination, // Return pagination info
   });
});

// Get a single post by ID
exports.getPost = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.id);
   if (!post) throw new Error(`Post not found with ID: ${req.params.id}`, 404);
   res.status(200).json({
      success: true,
      post,
   });
});

// Update a post by ID
exports.updatePost = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.id);
   if (!post) {
      throw new Error(`Post not found with ID: ${req.params.id}`, 400);
   }

   // Check if user is allowed to update the post
   if (req.params.id !== req.userId && req.role !== "admin") {
      throw new Error(`You do not have permission to update this post.`, 400);
   }

   // Update the fields that are passed in the request body
   Object.keys(req.body).forEach((key) => {
      post[key] = req.body[key];
   });

   await post.save();
   res.status(200).json({
      success: true,
      post,
   });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.id);
   if (!post) {
      throw new Error(`Post not found with ID: ${req.params.id}`, 400);
   }

   // Check if the user is allowed to delete the post
   if (req.params.id !== req.userId && req.role !== "admin") {
      throw new Error(`You do not have permission to delete this post.`, 400);
   }

   await post.deleteOne(); // Delete the post from the database
   res.status(200).json({
      success: true,
      message: "Post deleted successfully",
   });
});

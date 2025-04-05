const express = require("express");
const { protect, authorize } = require("../middleware/auth"); // Protect routes with authentication middleware
const {
   createPost,
   getPosts,
   getPost,
   updatePost,
   deletePost,
} = require("../controllers/post");

const router = express.Router();

// Route to create a new post
router.route("/").post(protect, createPost); // Only allow authenticated users to create posts

// Route to get all posts with paginat ion, sorting, and selecting specific fields
router.route("/").get(getPosts);

// Route to get a single post by ID
router.route("/:id").get(getPost);

// Route to update a post by ID
router.route("/:id").put(protect, updatePost);

// Route to delete a post by ID
router.route("/:id").delete(protect, deletePost);

module.exports = router;

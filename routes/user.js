const express = require("express");
const { protect, authorize } = require("../middleware/auth"); // Middleware for authentication and authorization
const {
   createUser,
   getUsers,
   getUser,
   updateUser,
   deleteUser,
   register,
   login,
   uploadUserPhoto,
} = require("../controllers/user");

const router = express.Router();

// Route to create a new user (requires admin access)
router.route("/").post(protect, createUser).get(protect, getUsers);

// Route to register a new user (no authentication needed)
router.route("/register").post(register);

// Route for user login (no authentication needed)
router.route("/login").post(login);

// Route to get a single user by ID (requires authentication and authorization)
router
   .route("/:id")
   .get(protect, getUser)
   .put(protect, updateUser)
   .delete(protect, deleteUser);

// Route to upload a user's photo (requires authentication)
// router.route("/:id/photo").put(protect, uploadMiddleware, uploadUserPhoto);

module.exports = router;

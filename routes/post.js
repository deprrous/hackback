const express = require("express");
const {
   createPost,
   getPost,
   getPosts,
   updatePost,
   deletePost,
} = require("../controllers/post");
const router = express.Router();

router.route("/").post(createPost).get(getPosts);

router.route("/:id").put(updatePost).delete(deletePost).get(getPost);
module.exports = router;

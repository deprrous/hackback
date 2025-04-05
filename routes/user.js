const express = require("express");
const { uploadMiddleware } = require("../middleware/upload");
const { protect, authorize } = require("../middleware/auth");
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

router.route("/").post(createUser).get(getUsers);
router.route("/register").post(register);
router.route("/login").post(login);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
module.exports = router;

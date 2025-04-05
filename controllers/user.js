const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const crypto = require("crypto");
const path = require("path");
// const fileUpload = require("express-fileupload");

exports.createUser = asyncHandler(async (req, res, next) => {
   const user = await User.create(req.body);
   if (!user) throw new Error("something is wrong", 403);
   res.status(200).json({
      succes: true,
      user,
   });
});
exports.getUsers = asyncHandler(async (req, res, next) => {
   const sort = req.query.sort;
   const select = req.query.select;
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 2;
   ["sort", "select", "page", "limit"].forEach((el) => delete req.query[el]);

   const pagination = await paginate(User, page, limit);

   const users = await User.find(req.query, select)
      .sort(sort)
      .skip(pagination.start - 1)
      .limit(limit);
   res.status(200).json({
      succes: true,
      total: users.length,
      data: users,
      pagination: pagination,
   });
});
exports.getUser = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.params.id);
   if (!user) throw new Error(`User not found id with ${req.params.id}`);
   res.status(200).json({
      succes: true,
      user,
   });
});
exports.updateUser = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.params.id);
   if (!user) {
      throw new Error(`User not found id with ${req.params.id}`, 400);
   }
   if (req.params.id !== req.userId && req.role !== "admin") {
      throw new Error(`Уучлаарай та хэрэглэгчийг өөрчлөх эрхгүй байна.`, 400);
   }

   Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
   });
   await user.save();
   res.status(200).json({
      succes: true,
      user,
   });
});
exports.deleteUser = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.params.id);
   if (!user) {
      throw new Error(`User not found id with ${req.params.id}`, 400);
   }
   if (req.params.id !== req.userId && req.role !== "admin") {
      throw new Error(`Уучлаарай та хэрэглэгчийг устгах эрхгүй байна.`, 400);
   }
   await user.deleteOne();

   await user.deleteOne();
   res.status(200).json({
      succes: true,
      user,
   });
});
exports.register = asyncHandler(async (req, res, next) => {
   const user = await User.create(req.body);
   if (!user) {
      throw new Error("something is wrong", 403);
   }
   const token = user.getJWT();
   res.status(200).json({
      succes: true,
      user,
      token,
   });
});
exports.login = asyncHandler(async (req, res, next) => {
   const { email, password } = req.body;
   if (!email || !password)
      throw new Error("Нууц үг эсвэл И-мэйл талбар хоосон байна", 400);

   const user = await User.findOne({ email: email }).select("+password");
   if (!user) throw new Error(`User not found email with ${email}`);

   // Correct method name (checkPassword)
   const match = await user.checkPassword(password);

   if (!match) {
      throw new Error("Нууц үг эсвэл И-мэйл талбар буруу байна", 400);
   }

   res.status(200).json({
      succes: true,
      user,
      token: user.getJWT(),
   });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
   const { currentPassword, newPassword } = req.body;
   if (!currentPassword || !newPassword)
      throw new Error("Хоосон талбар илгээгээд байна аа хө", 402);

   const user = await User.findOne({ _id: req.userId }).select("+password");
   console.log(user);
   const match = await user.checkPass(currentPassword);
   if (!match) {
      throw new Error("Password is not valid!", 402);
   }
   user.password = newPassword;
   user.save();
   res.status(200).json({
      succes: true,
      user: user,
   });
});

exports.uploadUserPhoto = asyncHandler(async (req, res, next) => {
   console.log("Received file:", req.file); // Debugging log for single file upload

   if (!req.file) {
      throw new Error("No file uploaded");
   }

   const user = await User.findById(req.params.id);
   if (!user) {
      throw new Error(`User with ID ${req.params.id} not found`);
   }

   user.photo_path = req.file.filename;
   await user.save();

   res.status(200).json({
      success: true,
      data: req.file.filename,
   });
});

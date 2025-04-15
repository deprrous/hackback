// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, process.env.FILE_UPLOAD_PATH || "uploads/"); // Ensure folder exists
//    },
//    filename: function (req, file, cb) {
//       const ext = path.extname(file.originalname);
//       cb(null, `photo_${req.params.id}${ext}`); // Renaming the file to include the user ID
//    },
// });

// // File filter to allow only image files
// const fileFilter = (req, file, cb) => {
//    if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only image files are allowed!"), false);
//    }
//    cb(null, true);
// };

// const upload = multer({
//    storage: storage,
//    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB file size limit
//    fileFilter: fileFilter,
// });

// exports.uploadMiddleware = upload.single("file"); // 'file' should match the Postman key

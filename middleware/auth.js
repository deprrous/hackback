const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
exports.protect = asyncHandler(async (req, res, next) => {
   if (!req.headers.authorization) throw new Error("Эрх зөвшөөрөгдөөгүй", 401);

   const token = req.headers.authorization.split(" ")[1];
   if (!token) throw new myError("Эрх зөвшөөрөгдөөгүй", 401);
   const tokenObj = jwt.verify(token, process.env.JWT_SECRET);
   req.userId = tokenObj.id;
   req.role = tokenObj.role;
   next();
});

exports.authorize = function (...roles) {
   return (req, res, next) => {
      if (!roles.includes(req.role)) {
         throw new myError(
            "Таны эрх " +
               req.role +
               " энэ үйлдлийг хийх боломжгүй. " +
               roles +
               " эдгээр эрхээр нэвтэрнэ үү.",
            403,
         );
      }
      next();
   };
};

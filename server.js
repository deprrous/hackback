const express = require("express");
const db = require("./config/db");
// const fileUpload = require("express-fileupload");
const path = require("path");
require("dotenv").config({ path: "./.env" });

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const matchRoutes = require("./routes/match");
app = express();
db();
app.use(express.json());
app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
   );
   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

   if (req.method === "OPTIONS") {
      return res.sendStatus(200);
   }

   next();
});
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use("/api/users", usersRoutes);

// app.use(
//    fileUpload({
//       limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
//    }),
// );

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/matches", matchRoutes);

app.get("/", (req, res) => {
   res.send("Welcome to the API!");
});

app.listen(
   process.env.PORT,
   console.log(`Server is started on ${process.env.PORT}`),
);

process.on(`unhandledRejection`, (err, promise) => {
   console.log(`Error : ${err.message}`);
   server.close(() => {
      process.exit(1);
   });
});

const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match");
const { protect } = require("../middleware/auth");

// Route to get the newsfeed based on shared learning interests
router.get("/newsfeed", matchController.getNewsfeed);

// Route to handle user choice (yes/no) for matching
router.post("/choice", matchController.handleChoice);

// Route to create a match request
router.post("/request", matchController.createMatchRequest);

// Route to get all match requests for the current user
router.get("/requests", matchController.getMatchRequests);

// Route to get all confirmed matches for the current user
router.get("/matches", matchController.getUserMatches);

// Route to respond to a match request (yes/no)
router.post(
   "/respond-to-match-request",

   matchController.respondToMatchRequest,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match");
const { protect } = require("../middleware/auth");

// Route to get the newsfeed based on shared learning interests
router.get("/newsfeed", protect, matchController.getNewsfeed);

// Route to handle user choice (yes/no) for matching
router.post("/choice", matchController.handleChoice);

// Route to get all confirmed matches for the current user
router.get("/matches", matchController.getUserMatches);

// Route to respond to a match request (yes/no)
router.post("/respond-to-match-request", matchController.respondToMatchRequest);

module.exports = router;

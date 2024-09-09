const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const userController = require("../../controllers/admin/users"); // Import user controller
const authenticateAdminToken = require("../../middleware/authAdminToken"); // Middleware to authenticate admin tokens

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Get all users (requires authentication)
router.get("/getAllUsers", authenticateAdminToken, userController.getAllUsers);

// Get details of a specific user (requires authentication)
router.get(
	"/getUserDetails",
	authenticateAdminToken,
	userController.getUserDetails
);

module.exports = router; // Export the router for use in other modules

const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const reportController = require("../../controllers/admin/reports"); // Import report controller
const authenticateAdminToken = require("../../middleware/authAdminToken"); // Middleware to authenticate admin tokens

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Generate a report (requires admin authentication)
router.post(
	"/generateReport",
	authenticateAdminToken,
	reportController.generateReport
);

// Get all reports (requires admin authentication)
router.get(
	"/getAllReports",
	authenticateAdminToken,
	reportController.getAllReports
);

module.exports = router; // Export the router for use in other modules

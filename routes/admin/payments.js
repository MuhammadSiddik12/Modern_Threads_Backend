const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const paymentController = require("../../controllers/admin/payments"); // Import payment controller
const authenticateAdminToken = require("../../middleware/authAdminToken"); // Middleware to authenticate admin tokens

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Get all payments (requires authentication)
router.get(
	"/getAllPayments",
	authenticateAdminToken,
	paymentController.getAllPayments
);

// Get details of a specific payment (requires authentication)
router.get(
	"/getPaymentDetails",
	authenticateAdminToken,
	paymentController.getPaymentDetails
);

module.exports = router; // Export the router for use in other modules

const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const paymentController = require("../../controllers/users/payments"); // Import payment controller
const authenticateToken = require("../../middleware/authUserToken"); // Middleware to authenticate user tokens

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Create a payment checkout (requires authentication)
router.post(
	"/createPaymentCheckout",
	authenticateToken,
	paymentController.createPaymentCheckout
);

// Get all payments for the authenticated user (requires authentication)
router.get(
	"/getAllPayments",
	authenticateToken,
	paymentController.getAllPayments
);

// Get details of a specific payment (requires authentication)
router.get(
	"/getPaymentDetails",
	authenticateToken,
	paymentController.getPaymentDetails
);

// Get all payments status from stripe webhook
router.post("/webhook", paymentController.webhook);

module.exports = router; // Export the router for use in other modules

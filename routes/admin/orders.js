const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const orderController = require("../../controllers/admin/orders"); // Import order controller
const authenticateAdminToken = require("../../middleware/authAdminToken"); // Middleware to authenticate admin tokens

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Get all orders (requires authentication)
router.get(
	"/getAllOrders",
	authenticateAdminToken,
	orderController.getAllOrders
);

// Get details of a specific order (requires authentication)
router.get(
	"/getOrderDetails",
	authenticateAdminToken,
	orderController.getOrderDetails
);

module.exports = router; // Export the router for use in other modules

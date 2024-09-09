const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const orderController = require("../../controllers/users/orders"); // Import order controller
const authenticateToken = require("../../middleware/authUserToken"); // Middleware to authenticate user tokens

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Create a new order (requires authentication)
router.post("/createOrder", authenticateToken, orderController.createOrder);

// Get all orders for the authenticated user (requires authentication)
router.get(
	"/getAllMyOrders",
	authenticateToken,
	orderController.getAllMyOrders
);

// Get details of a specific order by its ID (requires authentication)
router.get(
	"/getOrderDetailsById",
	authenticateToken,
	orderController.getOrderDetailsById
);

// Cancel an order by its ID (requires authentication)
router.delete(
	"/cancelOrderById",
	authenticateToken,
	orderController.cancelOrderById
);

module.exports = router; // Export the router for use in other modules

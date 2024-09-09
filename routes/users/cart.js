const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const cartController = require("../../controllers/users/cart"); // Import cart controller
const authenticateToken = require("../../middleware/authUserToken"); // Middleware to authenticate user tokens
const orderRouter = require("./orders"); // Import order routes

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Add item to cart (requires authentication)
router.post("/addToCart", authenticateToken, cartController.addToCart);

// Update cart (requires authentication)
router.put("/updateCart", authenticateToken, cartController.updateCart);

// Get all cart items (requires authentication)
router.get(
	"/getAllCartItems",
	authenticateToken,
	cartController.getAllCartItems
);

// Remove item from cart (requires authentication)
router.delete("/removeItem", authenticateToken, cartController.removeItem);

// Mount order routes under "/order"
router.use("/order", orderRouter);

module.exports = router; // Export the router for use in other modules

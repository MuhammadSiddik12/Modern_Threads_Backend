const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const productController = require("../../controllers/admin/product"); // Import product controller
const authenticateAdminToken = require("../../middleware/authAdminToken"); // Middleware to authenticate admin tokens

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Add a new product (requires authentication)
router.post(
	"/addProduct",
	authenticateAdminToken,
	productController.addProduct
);

// Update an existing product (requires authentication)
router.put(
	"/updateProduct",
	authenticateAdminToken,
	productController.updateProduct
);

// Delete a product (requires authentication)
router.delete(
	"/deleteProduct",
	authenticateAdminToken,
	productController.deleteProduct
);

// Get all products (requires authentication)
router.get(
	"/getAllProducts",
	authenticateAdminToken,
	productController.getAllProducts
);

// Get details of a specific product by its ID (requires authentication)
router.get(
	"/getProductById",
	authenticateAdminToken,
	productController.getProductById
);

module.exports = router; // Export the router for use in other modules

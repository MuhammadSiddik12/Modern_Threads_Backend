const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const productController = require("../../controllers/users/product"); // Import product controller

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Get all products
router.get("/getAllProducts", productController.getAllProducts);

// Get a specific product by its ID
router.get("/getProductById", productController.getProductById);

// Get all products by category
router.get(
	"/getAllProductsByCategory",
	productController.getAllProductsByCategory
);

module.exports = router; // Export the router for use in other modules

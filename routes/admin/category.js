const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const categoryController = require("../../controllers/admin/category"); // Import category controller
const authenticateAdminToken = require("../../middleware/authAdminToken"); // Middleware to authenticate admin tokens

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Create a new category (requires authentication)
router.post(
	"/createCategory",
	authenticateAdminToken,
	categoryController.createCategory
);

// Update an existing category (requires authentication)
router.put(
	"/updateCategory",
	authenticateAdminToken,
	categoryController.updateCategory
);

// Delete a category (requires authentication)
router.delete(
	"/deleteCategory",
	authenticateAdminToken,
	categoryController.deleteCategory
);

// Get all categories (requires authentication)
router.get(
	"/getAllCategories",
	authenticateAdminToken,
	categoryController.getAllCategories
);

// Get details of a specific category (requires authentication)
router.get(
	"/getCategoryDetails",
	authenticateAdminToken,
	categoryController.getCategoryDetails
);

module.exports = router; // Export the router for use in other modules

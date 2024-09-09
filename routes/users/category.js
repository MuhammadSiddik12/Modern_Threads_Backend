const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const categoryController = require("../../controllers/users/category"); // Import category controller

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Get all categories
router.get("/getAllCategories", categoryController.getAllCategories);

// Get details of a specific category
router.get("/getCategoryDetails", categoryController.getCategoryDetails);

module.exports = router; // Export the router for use in other modules

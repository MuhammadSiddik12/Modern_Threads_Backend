const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/users/category");
const authenticateToken = require("../../middleware/authUserToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get(
	"/getAllCategories",
	authenticateToken,
	categoryController.getAllCategories
);
router.get(
	"/getCategoryDetails",
	authenticateToken,
	categoryController.getCategoryDetails
);

module.exports = router;

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");
const authenticateAdminToken = require("../middleware/authAdminToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post(
	"/createCategory",
	authenticateAdminToken,
	categoryController.createCategory
);
router.put(
	"/updateCategory",
	authenticateAdminToken,
	categoryController.updateCategory
);

module.exports = router;

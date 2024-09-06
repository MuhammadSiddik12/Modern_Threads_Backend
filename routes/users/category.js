const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/users/category");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllCategories", categoryController.getAllCategories);
router.get("/getCategoryDetails", categoryController.getCategoryDetails);

module.exports = router;

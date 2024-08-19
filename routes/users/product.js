const express = require("express");
const router = express.Router();
const productController = require("../../controllers/users/product");
const authenticateToken = require("../../middleware/authUserToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.get(
	"/getAllProducts",
	authenticateToken,
	productController.getAllProducts
);
router.get(
	"/getProductById",
	authenticateToken,
	productController.getProductById
);

module.exports = router;

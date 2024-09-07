const express = require("express");
const router = express.Router();
const productController = require("../../controllers/users/product");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductById", productController.getProductById);
router.get(
	"/getAllProductsByCategory",
	productController.getAllProductsByCategory
);

module.exports = router;

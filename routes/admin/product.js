const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/product");
const authenticateAdminToken = require("../../middleware/authAdminToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.post(
	"/addProduct",
	authenticateAdminToken,
	productController.addProduct
);
router.put(
	"/updateProduct",
	authenticateAdminToken,
	productController.updateProduct
);
router.delete(
	"/deleteProduct",
	authenticateAdminToken,
	productController.deleteProduct
);
router.get(
	"/getAllProducts",
	authenticateAdminToken,
	productController.getAllProducts
);
router.get(
	"/getProductById",
	authenticateAdminToken,
	productController.getProductById
);

module.exports = router;

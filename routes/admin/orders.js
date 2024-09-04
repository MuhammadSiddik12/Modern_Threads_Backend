const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/admin/orders");
const authenticateAdminToken = require("../../middleware/authAdminToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllOrders", authenticateAdminToken, orderController.getAllOrders);
router.get(
	"/getOrderDetails",
	authenticateAdminToken,
	orderController.getOrderDetails
);

module.exports = router;

const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/admin/payments");
const authenticateAdminToken = require("../../middleware/authAdminToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get(
	"/getAllPayments",
	authenticateAdminToken,
	paymentController.getAllPayments
);
router.get(
	"/getPaymentDetails",
	authenticateAdminToken,
	paymentController.getPaymentDetails
);

module.exports = router;

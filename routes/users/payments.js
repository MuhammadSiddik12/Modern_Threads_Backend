const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/users/payments");
const authenticateToken = require("../../middleware/authUserToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post(
	"/createPaymentCheckout",
	authenticateToken,
	paymentController.createPaymentCheckout
);

module.exports = router;

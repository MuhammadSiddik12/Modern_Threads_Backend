const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/users/orders");
const authenticateToken = require("../../middleware/authUserToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post("/createOrder", authenticateToken, orderController.createOrder);

module.exports = router;

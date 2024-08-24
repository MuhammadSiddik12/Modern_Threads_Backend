const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/users/cart");
const authenticateToken = require("../../middleware/authUserToken");
const orderRouter = require("./orders");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post("/addToCart", authenticateToken, cartController.addToCart);
router.put("/updateCart", authenticateToken, cartController.updateCart);
router.get(
	"/getAllCartItems",
	authenticateToken,
	cartController.getAllCartItems
);

// order routes
router.use("/order", orderRouter);

module.exports = router;

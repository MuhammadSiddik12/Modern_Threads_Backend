const express = require("express");
const router = express.Router();
const userController = require("../../controllers/users/users");
const authenticateToken = require("../../middleware/authUserToken");
const productRouter = require("./product");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post("/userRegister", userController.userRegister);
router.post("/userLogin", userController.userLogin);
router.get("/getUserDetails", authenticateToken, userController.getUserDetails);
router.put(
	"/editUserProfile",
	authenticateToken,
	userController.editUserProfile
);
// product routes
router.use("/products", productRouter);

module.exports = router;

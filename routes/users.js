const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const authenticateToken = require("../middleware/authUserToken");

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

module.exports = router;

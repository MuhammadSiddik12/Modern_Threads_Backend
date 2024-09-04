const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/users");
const authenticateAdminToken = require("../../middleware/authAdminToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllUsers", authenticateAdminToken, userController.getAllUsers);
router.get(
	"/getUserDetails",
	authenticateAdminToken,
	userController.getUserDetails
);

module.exports = router;

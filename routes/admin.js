const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const authenticateAdminToken = require("../middleware/authAdminToken");
const categoryRouter = require("./category");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post("/adminSignup", adminController.adminSignup);
router.post("/adminLogin", adminController.adminLogin);
router.put(
	"/editAdminProfile",
	authenticateAdminToken,
	adminController.editAdminProfile
);
router.get(
	"/getAdminDetails",
	authenticateAdminToken,
	adminController.getAdminDetails
);

// category routes
router.use("/category", categoryRouter);

module.exports = router;

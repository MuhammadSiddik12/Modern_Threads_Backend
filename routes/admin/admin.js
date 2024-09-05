const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/admin");
const authenticateAdminToken = require("../../middleware/authAdminToken");
const categoryRouter = require("./category");
const productRouter = require("./product");
const userRouter = require("./users");
const orderRouter = require("./orders");
const paymentRouter = require("./payments");

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

router.get(
	"/dashboardDetails",
	authenticateAdminToken,
	adminController.dashboardDetails
);

// category routes
router.use("/category", categoryRouter);

// product routes
router.use("/products", productRouter);

// user routes
router.use("/users", userRouter);

// orders routes
router.use("/orders", orderRouter);

// payments routes
router.use("/payments", paymentRouter);

module.exports = router;

const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const adminController = require("../../controllers/admin/admin"); // Import admin controller
const authenticateAdminToken = require("../../middleware/authAdminToken"); // Middleware to authenticate admin tokens
const categoryRouter = require("./category"); // Import category routes
const productRouter = require("./product"); // Import product routes
const userRouter = require("./users"); // Import user routes
const orderRouter = require("./orders"); // Import order routes
const paymentRouter = require("./payments"); // Import payment routes

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Admin signup
router.post("/adminSignup", adminController.adminSignup);

// Admin login
router.post("/adminLogin", adminController.adminLogin);

// Edit the profile of the authenticated admin (requires authentication)
router.put(
	"/editAdminProfile",
	authenticateAdminToken,
	adminController.editAdminProfile
);

// Get details of the authenticated admin (requires authentication)
router.get(
	"/getAdminDetails",
	authenticateAdminToken,
	adminController.getAdminDetails
);

// Get dashboard details for the authenticated admin (requires authentication)
router.get(
	"/dashboardDetails",
	authenticateAdminToken,
	adminController.dashboardDetails
);

// Use category routes under "/category"
router.use("/category", categoryRouter);

// Use product routes under "/products"
router.use("/products", productRouter);

// Use user routes under "/users"
router.use("/users", userRouter);

// Use order routes under "/orders"
router.use("/orders", orderRouter);

// Use payment routes under "/payments"
router.use("/payments", paymentRouter);

module.exports = router; // Export the router for use in other modules

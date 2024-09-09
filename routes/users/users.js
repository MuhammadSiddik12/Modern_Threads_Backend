const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const userController = require("../../controllers/users/users"); // Import user controller
const authenticateToken = require("../../middleware/authUserToken"); // Middleware to authenticate user tokens
const productRouter = require("./product"); // Import product routes
const categoryRouter = require("./category"); // Import category routes
const cartRouter = require("./cart"); // Import cart routes
const paymentRouter = require("./payments"); // Import payment routes

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource"); // Respond with a placeholder message
});

// Register a new user
router.post("/userRegister", userController.userRegister);

// Login a user
router.post("/userLogin", userController.userLogin);

// Get details of the authenticated user (requires authentication)
router.get("/getUserDetails", authenticateToken, userController.getUserDetails);

// Edit the profile of the authenticated user (requires authentication)
router.put(
	"/editUserProfile",
	authenticateToken,
	userController.editUserProfile
);

// Use product routes under "/products"
router.use("/products", productRouter);

// Use category routes under "/category"
router.use("/category", categoryRouter);

// Use cart routes under "/cart"
router.use("/cart", cartRouter);

// Use payment routes under "/payments"
router.use("/payments", paymentRouter);

module.exports = router; // Export the router for use in other modules

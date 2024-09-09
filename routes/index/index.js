const express = require("express"); // Express framework
const router = express.Router(); // Create a new router object
const usersRouter = require("../users/users"); // Import user routes
const adminRouter = require("../admin/admin"); // Import admin routes
const { uploadImage } = require("../../controllers/index"); // Import image upload controller

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" }); // Render the home page with title "Express"
});

// Use user routes under "/users"
router.use("/users", usersRouter);

// Use admin routes under "/admin"
router.use("/admin", adminRouter);

// Handle image upload
router.post("/uploadImage", uploadImage);

module.exports = router; // Export the router for use in other modules

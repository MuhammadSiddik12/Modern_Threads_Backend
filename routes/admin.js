const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const authenticateToken = require("../middleware/authUserToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post("/adminSignup", adminController.adminSignup);

module.exports = router;

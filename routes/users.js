const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.post("/userRegister", userController.userRegister);
router.post("/userLogin", userController.userLogin);

module.exports = router;

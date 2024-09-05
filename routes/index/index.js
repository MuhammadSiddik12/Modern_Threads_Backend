const express = require("express");
const router = express.Router();
const usersRouter = require("../users/users");
const adminRouter = require("../admin/admin");
const { uploadImage } = require("../../controllers/index");

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});
router.use("/users", usersRouter);
router.use("/admin", adminRouter);
router.post("/uploadImage", uploadImage);

module.exports = router;

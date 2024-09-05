const multer = require("multer");
const path = require("path");

// Set up storage engine
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Define the destination folder for uploaded files
		cb(null, "uploads/"); // Make sure this folder exists or create it
	},
	filename: (req, file, cb) => {
		// Define the naming convention for uploaded files
		cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1667838237362.jpg
	},
});

// File filter to restrict the types of files that can be uploaded
const fileFilter = (req, file, cb) => {
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb("Error: Images only allowed!");
	}
};

// Initialize multer with storage, limits, and file filter
const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 5MB
	fileFilter: fileFilter,
}).single("image"); // Single file upload with the name 'image'

module.exports = upload;

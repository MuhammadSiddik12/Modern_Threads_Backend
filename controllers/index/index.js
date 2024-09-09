const upload = require("../../middleware/multerConfig");

exports.uploadImage = (req, res) => {
	try {
		upload(req, res, (err) => {
			// Log any error that occurs during the upload process
			console.log("🚀 ~ upload ~ err:", err);

			if (err) {
				return res.status(400).json({ success: false, message: err });
			}

			if (!req.file) {
				// No file was uploaded
				return res
					.status(400)
					.json({ success: false, message: "Please provide a file." });
			}

			// Successfully uploaded
			return res.status(200).json({
				success: true, // This should be true on successful upload
				message: "Image uploaded successfully",
				filePath: `/uploads/${req.file.filename}`, // The path where the file is stored
			});
		});
	} catch (error) {
		// Handle unexpected errors
		return res.status(500).json({
			success: false,
			message: "Failed to upload image",
			error: error.message,
		});
	}
};

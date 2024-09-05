const upload = require("../../middleware/multerConfig");

exports.uploadImage = (req, res) => {
	try {
		upload(req, res, (err) => {
			console.log("🚀 ~ upload ~ err:", err)
			if (err) {
				return res.status(400).json({ success: false, message: err });
			}

			if (!req.file) {
				return res
					.status(400)
					.json({ success: false, message: "Please provide file." });
			}

			return res.status(200).json({
				success: false,
				message: "Image uploaded successfully",
				filePath: `/uploads/${req.file.filename}`, // The path where the file is stored
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to upload image",
			error: error.message,
		});
	}
};

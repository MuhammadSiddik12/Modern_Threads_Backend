const Category = require("../models/category");

exports.createCategory = async (req, res) => {
	try {
		// Collect Category Info
		const { category_name } = req.body;

		// Validate Inputs
		if (!category_name) {
			return res.status(400).json({
				success: false,
				message: "Category name is required.",
			});
		}

		const findCategory = await Category.findOne({
			category_name,
		});

		if (findCategory) {
			return res.status(400).json({
				success: false,
				message: "Category already exist.",
			});
		}

		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-6);

		// Create Category Record
		const newCategory = await Category.create({
			category_name,
			category_id: `cate${lastSixDigits}`,
		});

		// Send Confirmation
		return res.status(201).json({
			success: true,
			message: "Category created successfully!",
			data: newCategory,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to create category",
			error: error.message,
		});
	}
};

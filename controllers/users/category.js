const Category = require("../../models/category");

exports.getAllCategories = async (req, res) => {
	try {
		// Fetch all categories
		const categories = await Category.findAll();

		return res.status(200).json({
			success: true,
			message: "Categories fetched successfully!",
			data: categories,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch categories",
			error: error.message,
		});
	}
};

exports.getCategoryDetails = async (req, res) => {
	try {
		const { category_id } = req.query; // Extract category ID from the request query

		// Validate Inputs
		if (!category_id) {
			return res.status(400).json({
				success: false,
				message: "Category id is required.",
			});
		}

		// Fetch the category by ID
		const category = await Category.findOne({
			where: { category_id },
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Category fetched successfully!",
			data: category,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch category",
			error: error.message,
		});
	}
};

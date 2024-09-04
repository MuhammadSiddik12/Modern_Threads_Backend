const Category = require("../../models/category");

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
			where: { category_name: category_name },
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

exports.updateCategory = async (req, res) => {
	try {
		const { category_id, category_name } = req.body;

		// Validate Inputs
		if (!category_id) {
			return res.status(400).json({
				success: false,
				message: "Category id is required.",
			});
		}

		// find Category Record
		const category = await Category.findOne({
			where: { category_id, status: "active" },
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found.",
			});
		}

		// Update category details
		category.category_name = category_name;

		await category.save();

		// Send Confirmation
		return res.status(200).json({
			success: true,
			message: "Category updated successfully!",
			data: category,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update category",
			error: error.message,
		});
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		const { category_id } = req.query; // Extract category ID from the request body

		// Validate Inputs
		if (!category_id) {
			return res.status(400).json({
				success: false,
				message: "Category id is required.",
			});
		}

		// Validate and Check Category Existence
		const category = await Category.findOne({
			where: { category_id, status: "active" },
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found.",
			});
		}

		// Delete Category Record
		await category.destroy();

		// Send Confirmation
		return res.status(200).json({
			success: true,
			message: "Category deleted successfully!",
			data: {},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to delete category",
			error: error.message,
		});
	}
};

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

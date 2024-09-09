const { Op } = require("sequelize");
const Category = require("../../models/category");

exports.createCategory = async (req, res) => {
	try {
		const { category_name, category_image } = req.body;

		// Validate input fields
		if (!category_name) {
			return res.status(400).json({
				success: false,
				message: "Category name is required.",
			});
		}

		// Check if the category already exists
		const findCategory = await Category.findOne({
			where: { category_name },
		});

		if (findCategory) {
			return res.status(400).json({
				success: false,
				message: "Category already exists.",
			});
		}

		// Generate a unique category ID
		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-6);

		// Create a new category record
		const newCategory = await Category.create({
			category_name,
			category_id: `cate${lastSixDigits}`,
			category_image,
		});

		// Send confirmation response
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
		const { category_id, category_name, category_image } = req.body;

		// Validate input fields
		if (!category_id) {
			return res.status(400).json({
				success: false,
				message: "Category ID is required.",
			});
		}

		// Find the category record
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
		category.category_name = category_name || category.category_name;
		category.category_image = category_image || category.category_image;

		// Save the updated category
		await category.save();

		// Send confirmation response
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
		const { category_id } = req.query; // Extract category ID from query

		// Validate input fields
		if (!category_id) {
			return res.status(400).json({
				success: false,
				message: "Category ID is required.",
			});
		}

		// Find the category record
		const category = await Category.findOne({
			where: { category_id, status: "active" },
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found.",
			});
		}

		// Soft delete the category by setting status to inactive
		await category.update({ status: "inactive" });

		// Send confirmation response
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
		const { page, limit, search } = req.query;

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch categories with pagination and search
		const categories = await Category.findAll({
			where: {
				category_name: {
					[Op.like]: `%${search}%`, // Search by category name (case insensitive)
				},
			},
			limit: pageSize, // Number of items per page
			offset: (pageNumber - 1) * pageSize, // Calculate offset for pagination
		});

		// Fetch total count of categories for pagination
		const total_categories = await Category.count({
			where: {
				category_name: {
					[Op.like]: `%${search}%`, // Search by category name (case insensitive)
				},
			},
		});

		return res.status(200).json({
			success: true,
			message: "Categories fetched successfully!",
			data: categories,
			total_count: Math.ceil(total_categories / pageSize),
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
		const { category_id } = req.query; // Extract category ID from query

		// Validate input fields
		if (!category_id) {
			return res.status(400).json({
				success: false,
				message: "Category ID is required.",
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

const { Op } = require("sequelize");
const Category = require("../../models/category");
const Product = require("../../models/product");

exports.addProduct = async (req, res) => {
	try {
		const {
			product_name,
			description,
			price,
			category_id,
			stock_quantity,
			product_images,
		} = req.body;

		// Check if the product already exists
		const existingProduct = await Product.findOne({
			where: { product_name },
		});

		if (existingProduct) {
			return res.status(400).json({
				success: false,
				message: "Product already exists.",
			});
		}

		// Generate a unique product ID
		const timestamp = Date.now();
		const lastSixDigits = timestamp.toString().slice(-6);

		// Create a new product
		const newProduct = await Product.create({
			product_id: `prod${lastSixDigits}`,
			product_name,
			description,
			price,
			category_id,
			stock_quantity,
			product_images,
		});

		return res.status(201).json({
			success: true,
			message: "Product added successfully!",
			data: newProduct,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to add product",
			error: error.message,
		});
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const {
			product_id,
			product_name,
			description,
			price,
			category_id,
			stock_quantity,
			product_images,
		} = req.body;

		// Validate input
		if (!product_id) {
			return res.status(400).json({
				success: false,
				message: "Product ID is required.",
			});
		}

		// Find product by ID
		const product = await Product.findOne({
			where: { product_id },
		});

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found.",
			});
		}

		// Update product details
		await product.update({
			product_name,
			description,
			price,
			category_id,
			stock_quantity,
			product_images,
		});

		return res.status(200).json({
			success: true,
			message: "Product updated successfully!",
			data: product,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update product",
			error: error.message,
		});
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const { product_id } = req.query;

		// Validate input
		if (!product_id) {
			return res.status(400).json({
				success: false,
				message: "Product ID is required.",
			});
		}

		// Find product by ID
		const product = await Product.findOne({
			where: { product_id },
		});

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found.",
			});
		}

		// Delete the product
		await product.destroy();

		return res.status(200).json({
			success: true,
			message: "Product deleted successfully!",
			data: {},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to delete product",
			error: error.message,
		});
	}
};

exports.getAllProducts = async (req, res) => {
	try {
		const { page, limit, search } = req.query;

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch products with pagination and search
		const products = await Product.findAll({
			where: {
				[Op.or]: [
					{
						product_name: {
							[Op.like]: `%${search}%`, // Search by product name
						},
					},
					{
						description: {
							[Op.like]: `%${search}%`, // Search by product description
						},
					},
				],
			},
			include: [
				{
					model: Category,
					attributes: ["category_id", "category_name"], // Include category details
				},
			],
			limit: pageSize, // Number of items per page
			offset: (pageNumber - 1) * pageSize, // Calculate offset for pagination
		});

		// Fetch total count of products for pagination
		const totalProductsCount = await Product.count({
			where: {
				[Op.or]: [
					{
						product_name: {
							[Op.like]: `%${search}%`, // Search by product name
						},
					},
					{
						description: {
							[Op.like]: `%${search}%`, // Search by product description
						},
					},
				],
			},
		});

		return res.status(200).json({
			success: true,
			message: "Products fetched successfully!",
			data: products,
			total_count: Math.ceil(totalProductsCount / pageSize), // Total number of pages
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch products",
			error: error.message,
		});
	}
};

exports.getProductById = async (req, res) => {
	try {
		const { product_id } = req.query;

		// Validate input
		if (!product_id) {
			return res.status(400).json({
				success: false,
				message: "Product ID is required.",
			});
		}

		// Fetch the product by ID
		const product = await Product.findOne({
			where: { product_id },
			include: [
				{
					model: Category,
					attributes: ["category_id", "category_name"], // Include category details
				},
			],
		});

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Product fetched successfully!",
			data: product,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch product",
			error: error.message,
		});
	}
};

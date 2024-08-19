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

		const product = await Product.findOne({
			where: { product_name },
		});

		if (product) {
			return res.status(400).json({
				success: false,
				message: "Product alredy exist.",
			});
		}

		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-6);

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

		if (!product_id) {
			return res.status(400).json({
				success: false,
				message: "Product id is required.",
			});
		}

		// Find product by ID
		const product = await Product.findOne({
			where: { product_id: product_id },
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
		const { product_id } = req.body;

		if (!product_id) {
			return res.status(400).json({
				success: false,
				message: "Product id is required.",
			});
		}

		// Find product by ID
		const product = await Product.findOne({
			where: { product_id: product_id },
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
		// Fetch all products
		const products = await Product.findAll({
			include: [
				{
					model: Category,
					attributes: ["category_id", "category_name"], // Specify the attributes you need from Category
				},
			],
		});

		return res.status(200).json({
			success: true,
			message: "Products fetched successfully!",
			data: products,
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

		if (!product_id) {
			return res.status(400).json({
				success: false,
				message: "Product id is required.",
			});
		}

		// Fetch the product by ID
		const product = await Product.findOne({
			where: { product_id: product_id },
			include: [
				{
					model: Category,
					attributes: ["category_id", "category_name"], // Specify the attributes you need from Category
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

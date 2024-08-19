const Category = require("../../models/category");
const Product = require("../../models/product");

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

const { Op } = require("sequelize");
const Category = require("../../models/category");
const Product = require("../../models/product");
const Cart = require("../../models/cart");

exports.getAllProducts = async (req, res) => {
	try {
		// Fetch all orders
		const { page, limit, search } = req.query;
		// Fetch all categories

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch all products
		const products = await Product.findAll({
			where: {
				[Op.or]: [
					{
						product_name: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
					{
						description: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
				],
			},
			include: [
				{
					model: Category,
					attributes: ["category_id", "category_name"], // Specify the attributes you need from Category
				},
			],
			limit: pageSize, // Number of items per page
			offset: (pageNumber - 1) * pageSize, // Calculate offset for pagination
		});

		// Fetch all products
		const total_products = await Product.findAll({
			where: {
				[Op.or]: [
					{
						product_name: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
					{
						description: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
				],
			},
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
			total_count: Math.ceil(total_products.length / parseInt(limit, 10)),
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
		const findProduct = await Product.findOne({
			where: { product_id: product_id },
			include: [
				{
					model: Category,
					attributes: ["category_id", "category_name"], // Specify the attributes you need from Category
				},
			],
		});

		if (!findProduct) {
			return res.status(404).json({
				success: false,
				message: "Product not found.",
			});
		}
		const product = JSON.parse(JSON.stringify(findProduct));

		const productInCart = await Cart.findOne({
			where: { product_id: product_id },
		});

		product.is_added = !!productInCart;

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

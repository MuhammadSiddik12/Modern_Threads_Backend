const { Op } = require("sequelize");
const Category = require("../../models/category");
const Product = require("../../models/product");
const Cart = require("../../models/cart");

exports.getAllProducts = async (req, res) => {
	try {
		// Fetch all orders
		const { page, limit, search, user_id } = req.query;
		// Fetch all categories

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch all products
		const findProducts = await Product.findAll({
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

		const products = JSON.parse(JSON.stringify(findProducts));

		if (user_id != "") {
			const productInCart = await Cart.findAll({
				where: {
					product_id: { [Op.in]: products.map((e) => e.product_id) },
					order_created: false,
				},
			});

			for (let index = 0; index < products.length; index++) {
				const element = products[index];
				const findProductInCart = productInCart.find(
					(e) => e.product_id == element.product_id
				);
				element.is_added = !!findProductInCart;
			}
		}

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
			where: { product_id: product_id, order_created: false },
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

exports.getAllProductsByCategory = async (req, res) => {
	try {
		// Fetch all orders
		const { category_id, page, limit, search } = req.query;
		// Fetch all categories

		if (!category_id) {
			return res
				.status(400)
				.json({ success: false, message: "category id is required." });
		}

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch all products
		const findProducts = await Product.findAll({
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
					where: {
						category_id: category_id,
					},
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
					where: {
						category_id: category_id,
					},
					attributes: ["category_id", "category_name"], // Specify the attributes you need from Category
				},
			],
		});

		const products = JSON.parse(JSON.stringify(findProducts));

		const productInCart = await Cart.findAll({
			where: {
				product_id: {
					[Op.in]: products.map((e) => e.product_id),
				},
				order_created: false,
			},
		});

		for (let index = 0; index < products.length; index++) {
			const element = products[index];
			const findProductInCart = productInCart.find(
				(e) => e.product_id == element.product_id
			);
			element.is_added = !!findProductInCart;
		}

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

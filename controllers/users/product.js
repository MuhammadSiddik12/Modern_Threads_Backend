const { Op, Sequelize } = require("sequelize");
const Category = require("../../models/category");
const Product = require("../../models/product");
const Cart = require("../../models/cart");

exports.getAllProducts = async (req, res) => {
	try {
		const { page = 1, limit = 10, search = "", user_id } = req.query;

		// Convert page and limit to numbers
		const pageNumber = Number(page);
		const pageSize = Number(limit);

		// Fetch paginated products and total count
		let { count: totalProducts, rows: products } =
			await Product.findAndCountAll({
				where: {
					[Op.or]: [
						// Case-insensitive search for product name
						Sequelize.where(
							Sequelize.fn("LOWER", Sequelize.col("product_name")),
							{
								[Op.like]: `%${search.toLowerCase()}%`,
							}
						),
						// Case-insensitive search for description
						Sequelize.where(
							Sequelize.fn("LOWER", Sequelize.col("description")),
							{
								[Op.like]: `%${search.toLowerCase()}%`,
							}
						),
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

		if (user_id) {
			products = JSON.parse(JSON.stringify(products));
			// Fetch cart items for the user
			const cartItems = await Cart.findAll({
				where: {
					product_id: { [Op.in]: products.map((e) => e.product_id) },
					order_created: false,
					user_id
				},
			});

			// Mark products as added if they are in the cart
			products.forEach((product) => {
				product.is_added = cartItems.some(
					(item) => item.product_id === product.product_id
				);
			});
		}

		// Return the paginated products and total count
		return res.status(200).json({
			success: true,
			message: "Products fetched successfully!",
			data: products,
			total_count: Math.ceil(totalProducts / pageSize), // Calculate total pages
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
		const { product_id, user_id } = req.query;

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
					attributes: ["category_id", "category_name"], // Include category details
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

		if (user_id) {
			// Check if the product is in the user's cart
			const productInCart = await Cart.findOne({
				where: { product_id: product_id, order_created: false, user_id },
			});
			product.is_added = !!productInCart;
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

exports.getAllProductsByCategory = async (req, res) => {
	try {
		const {
			category_id,
			page = 1,
			limit = 10,
			search = "",
			user_id,
		} = req.query;

		if (!category_id) {
			return res.status(400).json({
				success: false,
				message: "Category id is required.",
			});
		}

		// Convert page and limit to numbers
		const pageNumber = Number(page);
		const pageSize = Number(limit);

		// Fetch paginated products and total count
		const { count: totalProducts, rows: products } =
			await Product.findAndCountAll({
				where: {
					[Op.or]: [
						// Case-insensitive search for product name
						{
							product_name: {
								[Op.iLike]: `%${search}%`,
							},
						},
						// Case-insensitive search for description
						{
							description: {
								[Op.iLike]: `%${search}%`,
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
						attributes: ["category_id", "category_name"], // Include category details
					},
				],
				limit: pageSize, // Number of items per page
				offset: (pageNumber - 1) * pageSize, // Calculate offset for pagination
			});

		// Fetch cart items for the user (if user_id is provided)
		const cartItems = user_id
			? await Cart.findAll({
					where: {
						product_id: { [Op.in]: products.map((e) => e.product_id) },
						order_created: false,
					},
			  })
			: [];

		// Mark products as added if they are in the cart
		products.forEach((product) => {
			product.is_added = cartItems.some(
				(item) => item.product_id === product.product_id
			);
		});

		// Return the paginated products and total count
		return res.status(200).json({
			success: true,
			message: "Products fetched successfully!",
			data: products,
			total_count: Math.ceil(totalProducts / pageSize), // Calculate total pages
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch products",
			error: error.message,
		});
	}
};

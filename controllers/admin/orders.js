const { Op } = require("sequelize");
const Cart = require("../../models/cart");
const Order = require("../../models/order");
const Product = require("../../models/product");
const User = require("../../models/user");

exports.getAllOrders = async (req, res) => {
	try {
		const { page, limit, search } = req.query;
		// Fetch all categories

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch all orders
		const orders = await Order.findAll({
			where: {
				[Op.or]: [
					{
						total_price: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
					{
						order_status: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
					{
						order_id: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
					{
						user_id: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
				],
			},
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"],
				},
			],
			limit: pageSize, // Number of items per page
			offset: (pageNumber - 1) * pageSize, // Calculate offset for pagination
		});

		const orders_count = await Order.findAll({
			where: {
				[Op.or]: [
					{
						total_price: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
					{
						order_status: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
					{
						order_id: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
					{
						user_id: {
							[Op.like]: `%${search}%`, // Search by category name (case insensitive)
						},
					},
				],
			},
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"],
				},
			],
		});

		return res.status(200).json({
			success: true,
			message: "Order fetched successfully!",
			data: orders,
			total_count: Math.ceil(orders_count.length / parseInt(limit, 10)),
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch orders",
			error: error.message,
		});
	}
};

exports.getOrderDetails = async (req, res) => {
	try {
		const { order_id } = req.query; // Extract order ID from the request query

		// Validate Inputs
		if (!order_id) {
			return res.status(400).json({
				success: false,
				message: "Order id is required.",
			});
		}

		const order = await Order.findOne({
			where: {
				order_id: order_id,
			},
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"],
				},
			],
		});

		if (!order) {
			return res.status(400).json({
				success: false,
				message: "order details not found.",
			});
		}

		// Find all cart items where product_id is in the array of order_items
		const cartItems = await Cart.findAll({
			where: {
				cart_id: {
					[Op.in]: order.order_items,
				},
			},
			include: [
				{
					model: Product,
					as: "product_details",
				},
			],
		});

		// Integrate cart items into order
		const ordersWithCart = {
			...order.toJSON(),
			cart_items: cartItems.filter((cartItem) =>
				order.order_items.includes(cartItem.cart_id)
			),
		};

		return res.status(200).json({
			success: true,
			message: "Order fetched successfully!",
			data: ordersWithCart,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch order",
			error: error.message,
		});
	}
};

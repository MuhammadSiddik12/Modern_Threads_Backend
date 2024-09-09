const { Op } = require("sequelize");
const Cart = require("../../models/cart");
const Order = require("../../models/order");
const Product = require("../../models/product");
const User = require("../../models/user");

exports.getAllOrders = async (req, res) => {
	try {
		const { page, limit, search } = req.query;

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch orders with pagination and search
		const orders = await Order.findAll({
			where: {
				[Op.or]: [
					{
						total_price: {
							[Op.like]: `%${search}%`, // Search by total price
						},
					},
					{
						order_status: {
							[Op.like]: `%${search}%`, // Search by order status
						},
					},
					{
						order_id: {
							[Op.like]: `%${search}%`, // Search by order ID
						},
					},
					{
						user_id: {
							[Op.like]: `%${search}%`, // Search by user ID
						},
					},
				],
			},
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"], // Include user details
				},
			],
			limit: pageSize, // Number of items per page
			offset: (pageNumber - 1) * pageSize, // Calculate offset for pagination
		});

		// Fetch total count of orders for pagination
		const orders_count = await Order.count({
			where: {
				[Op.or]: [
					{
						total_price: {
							[Op.like]: `%${search}%`, // Search by total price
						},
					},
					{
						order_status: {
							[Op.like]: `%${search}%`, // Search by order status
						},
					},
					{
						order_id: {
							[Op.like]: `%${search}%`, // Search by order ID
						},
					},
					{
						user_id: {
							[Op.like]: `%${search}%`, // Search by user ID
						},
					},
				],
			},
		});

		return res.status(200).json({
			success: true,
			message: "Orders fetched successfully!",
			data: orders,
			total_count: Math.ceil(orders_count / pageSize), // Total number of pages
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

		// Validate input
		if (!order_id) {
			return res.status(400).json({
				success: false,
				message: "Order ID is required.",
			});
		}

		// Fetch the order details
		const order = await Order.findOne({
			where: { order_id },
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"], // Include user details
				},
			],
		});

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order details not found.",
			});
		}

		// Fetch cart items related to the order
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

		// Integrate cart items into the order
		const orderWithCartItems = {
			...order.toJSON(),
			cart_items: cartItems.filter((cartItem) =>
				order.order_items.includes(cartItem.cart_id)
			),
		};

		return res.status(200).json({
			success: true,
			message: "Order details fetched successfully!",
			data: orderWithCartItems,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch order details",
			error: error.message,
		});
	}
};

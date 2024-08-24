const Cart = require("../../models/cart");
const Product = require("../../models/product");
const Order = require("../../models/order");
const { Op } = require("sequelize");
const { sequelize } = require("../../utils/sequelize");
const User = require("../../models/user");

exports.createOrder = async (req, res) => {
	try {
		const user_id = req.userId;

		const { shipping_address, billing_address, order_items } = req.body;

		if (!shipping_address || !billing_address || !order_items) {
			return res.status(400).json({
				success: false,
				message:
					"shipping_address, billing_address and order_items are required.",
			});
		}

		const findCart = await Cart.findAll({
			where: { cart_id: { [Op.in]: order_items } },
		});

		if (!findCart.length) {
			return res.status(400).json({
				success: false,
				message: "Cart items not found",
			});
		}

		const findOrder = await sequelize.query(
			"SELECT * FROM orders WHERE JSON_CONTAINS(order_items, :orderItems)",
			{
				replacements: { orderItems: JSON.stringify(order_items) },
				type: sequelize.QueryTypes.SELECT,
			}
		);

		if (findOrder.length) {
			return res.status(400).json({
				success: false,
				message: "Order alredy created.",
			});
		}

		const totalPrice = findCart.reduce((accumulator, currentValue) => {
			return accumulator + parseFloat(currentValue.price);
		}, 0); // Start with an initial value of 0

		if (totalPrice <= 0) {
			return res.status(400).json({
				success: false,
				message: "Cart value must be greater than 0",
			});
		}

		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-5);

		// Create a new order
		const newOrder = await Order.create({
			order_id: `order#${lastSixDigits}`, // Unique ID for the order
			user_id,
			total_price: totalPrice,
			shipping_address,
			billing_address,
			order_items,
		});

		return res.status(201).json({
			success: true,
			message: "Order created successfully!",
			data: newOrder,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to create order",
			error: error.message,
		});
	}
};

exports.getAllMyOrders = async (req, res) => {
	try {
		const orders = await Order.findAll({
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"],
				},
			],
		});

		const findCartItems = orders.flatMap((order) => order.order_items); // Flatten the order_items arrays into a single array

		// Find all cart items where product_id is in the array of order_items
		const cartItems = await Cart.findAll({
			where: {
				cart_id: {
					[Op.in]: findCartItems,
				},
			},
			include: [
				{
					model: Product,
					as: "product_details",
				},
			],
		});

		// Integrate cart items into each order
		const ordersWithCart = orders.map((order) => {
			return {
				...order.toJSON(),
				cart_items: cartItems.filter((cartItem) =>
					order.order_items.includes(cartItem.cart_id)
				),
			};
		});

		return res.status(200).json({
			success: true,
			message: "Orders fetched successfully!",
			data: ordersWithCart,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch orders",
			error: error.message,
		});
	}
};

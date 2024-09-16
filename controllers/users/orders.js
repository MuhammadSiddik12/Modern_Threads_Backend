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

		// Validate inputs
		if (!shipping_address || !billing_address || !order_items) {
			return res.status(400).json({
				success: false,
				message:
					"shipping_address, billing_address and order_items are required.",
			});
		}

		// Find cart items from the provided order_items
		const findCart = await Cart.findAll({
			where: { cart_id: { [Op.in]: order_items } },
		});

		if (!findCart.length) {
			return res.status(400).json({
				success: false,
				message: "Cart items not found",
			});
		}

		// Check if an order with the same items already exists
		const findOrder = await sequelize.query(
			"SELECT * FROM orders WHERE order_items @> :orderItems::jsonb;",
			{
				replacements: { orderItems: JSON.stringify(order_items) },
				type: sequelize.QueryTypes.SELECT,
			}
		);

		if (findOrder.length) {
			return res.status(400).json({
				success: false,
				message: "Order already created.",
			});
		}

		// Calculate the total price of the cart items
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
			order_id: `order${lastSixDigits}`, // Unique ID for the order
			user_id,
			total_price: totalPrice,
			shipping_address,
			billing_address,
			order_items,
		});

		// find all product based on cart product ids
		const findProducts = await Product.findAll({
			where: { product_id: { [Op.in]: findCart.map((e) => e.product_id) } },
		});

		findProducts.map((e) => {
			const findQuantity = findCart.find((f) => f.product_id == e.product_id);
			if (findQuantity) {
				e.stock_quantity = findQuantity.quantity; // update stock quantity
				e.save();
			}
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
		const user_id = req.userId;

		// Fetch all orders with user details
		const orders = await Order.findAll({
			where: { user_id },
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"],
				},
			],
		});

		// Flatten the order_items arrays into a single array
		const findCartItems = orders.flatMap((order) => order.order_items);

		// Find all cart items where cart_id is in the array of order_items
		const cartItems = await Cart.findAll({
			where: {
				cart_id: {
					[Op.in]: findCartItems,
				},
				user_id,
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

exports.getOrderDetailsById = async (req, res) => {
	try {
		const { order_id } = req.query;
		const user_id = req.userId;

		// Validate input
		if (!order_id) {
			return res.status(400).json({
				success: false,
				message: "order id is required.",
			});
		}

		// Fetch the order by ID with user details
		const order = await Order.findOne({
			where: {
				order_id: order_id,
				user_id,
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
				message: "Order details not found.",
			});
		}

		// Find all cart items where cart_id is in the array of order_items
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

exports.cancelOrderById = async (req, res) => {
	try {
		const { order_id } = req.query;
		const user_id = req.userId;

		// Validate input
		if (!order_id) {
			return res.status(400).json({
				success: false,
				message: "Order id is required.",
			});
		}

		// Find the order by ID
		const order = await Order.findOne({
			where: {
				order_id: order_id,
				user_id,
			},
		});

		if (!order) {
			return res.status(400).json({
				success: false,
				message: "Order details not found.",
			});
		}

		// Delete the order
		await order.destroy();

		return res.status(200).json({
			success: true,
			message: "Order canceled successfully!",
			data: {},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to cancel order",
			error: error.message,
		});
	}
};

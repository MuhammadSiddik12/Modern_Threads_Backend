const Cart = require("../../models/cart");
const Product = require("../../models/product");
const Order = require("../../models/order");
const { Op } = require("sequelize");
const User = require("../../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentCheckout = async (req, res) => {
	try {
		const { order_id } = req.body;

		if (!order_id) {
			return res.status(400).json({
				success: false,
				message: "order id is required.",
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

		if (!cartItems.length) {
			return res.status(400).json({
				success: false,
				message: "cart details not found.",
			});
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: cartItems.map((item) => ({
				price_data: {
					currency: "inr",
					product_data: {
						name: item.product_details.product_name,
					},
					unit_amount: item.price * 100,
				},
				quantity: item.quantity,
			})),
			mode: "payment",
			success_url: "https://localhost:3001/success",
			cancel_url: "https://localhost:3001/cancel",
		});

		return res.status(200).json({
			success: true,
			message: "Checkout created successfuly.",
			data: session.url,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to create payment",
			error: error.message,
		});
	}
};

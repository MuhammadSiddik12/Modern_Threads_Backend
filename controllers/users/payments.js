const Cart = require("../../models/cart");
const Product = require("../../models/product");
const Order = require("../../models/order");
const { Op } = require("sequelize");
const User = require("../../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../../models/payment");

exports.createPaymentCheckout = async (req, res) => {
	try {
		const { order_id } = req.body;

		const user_id = req.userId;

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
				order_created: false,
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

		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-6);

		await Payment.create({
			payment_id: `pay${lastSixDigits}`,
			order_id,
			user_id,
			payment_method: "card",
			amount: order.total_price,
			transaction_id: session.id,
		});

		await Cart.update(
			{ order_created: true },
			{
				where: { cart_id: { [Op.in]: order.order_items } },
			}
		);

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

exports.webhook = (req, res) => {
	try {
		const sig = req.headers["stripe-signature"];
		let event;

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				sig,
				process.env.END_POINT_SECRET
			);
		} catch (err) {
			console.log("Webhook Error:", err.message);
			return res
				.status(400)
				.json({ messsage: `Webhook Error: ${err.message}` });
		}

		// Handle the event
		switch (event.type) {
			case "checkout.session.completed":
				const session = event.data.object;
				// Perform actions based on the session object
				console.log("Checkout Session completed:", session);
				break;
			case "invoice.payment_succeeded":
				const invoice = event.data.object;
				// Perform actions based on the invoice object
				console.log("Invoice payment succeeded:", invoice);
				break;
			// Handle other event types as needed
			default:
				console.log("Unhandled event type:", event.type);
		}

		// Return a response to acknowledge receipt of the event
		return res.json({ received: true });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update payment",
			error: error.message,
		});
	}
};

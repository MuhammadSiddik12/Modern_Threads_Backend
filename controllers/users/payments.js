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

		// Validate input
		if (!order_id) {
			return res.status(400).json({
				success: false,
				message: "Order id is required.",
			});
		}

		// Fetch the order with user details
		const order = await Order.findOne({
			where: { order_id },
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

		// Fetch cart items for the order
		const cartItems = await Cart.findAll({
			where: {
				cart_id: { [Op.in]: order.order_items },
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
				message: "Cart details not found.",
			});
		}

		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-6);

		// Create a Stripe checkout session
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
			success_url: `https://modernthreads.vercel.app/success/pay${lastSixDigits}`,
			cancel_url: `https://modernthreads.vercel.app/failed/pay${lastSixDigits}`,
		});

		// Create a payment record
		await Payment.create({
			payment_id: `pay${lastSixDigits}`,
			order_id,
			user_id,
			payment_method: "card",
			amount: order.total_price,
			transaction_id: session.id,
		});

		// Mark cart items as having been ordered
		await Cart.update(
			{ order_created: true },
			{
				where: { cart_id: { [Op.in]: order.order_items } },
			}
		);

		return res.status(200).json({
			success: true,
			message: "Checkout created successfully.",
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

exports.webhook = async (req, res) => {
	try {
		let event = req.body;

		// Handle the event
		switch (event.type) {
			case "checkout.session.completed":
				const session = event.data.object;
				// Perform actions based on the session object
				console.log("Checkout Session completed:", session);

				let payment = await Payment.findOne({
					where: { transaction_id: session.id },
				});

				if (payment) {
					payment.payment_status = "success";
					payment.save();

					let order = await Order.findOne({
						where: { order_id: payment?.order_id },
					});

					if (order) {
						order.order_status = "Confirmed";
						order.save();
					}
				}

				break;
			case "invoice.payment_succeeded":
				const invoice = event.data.object;
				// Perform actions based on the invoice object
				console.log("Invoice payment succeeded:", invoice);
				let findPayment = await Payment.findOne({
					where: { transaction_id: session.id },
				});

				if (findPayment) {
					findPayment.payment_status = session.status;
					findPayment.save();
				}
				break;
			default:
				console.log("Unhandled event type:", event.type);
		}

		// Respond to acknowledge receipt of the event
		return res.json({ received: true });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update payment",
			error: error.message,
		});
	}
};

exports.getAllPayments = async (req, res) => {
	try {
		const { page, limit, search } = req.query;
		const user_id = req.userId;

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch payments with pagination
		const payment = await Payment.findAll({
			where: { user_id },
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"],
				},
				{
					model: Order,
					as: "order_details",
				},
			],
			limit: pageSize,
			offset: (pageNumber - 1) * pageSize,
		});

		// Fetch total count for pagination
		const total_payment = await Payment.findAll({
			where: {
				[Op.or]: [
					{
						transaction_id: {
							[Op.like]: `%${search}%`,
						},
					},
					{
						order_id: {
							[Op.like]: `%${search}%`,
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
				{
					model: Order,
					as: "order_details",
				},
			],
		});

		return res.status(200).json({
			success: true,
			message: "Payments fetched successfully!",
			data: payment,
			total_count: Math.ceil(total_payment.length / parseInt(limit, 10)),
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch payments",
			error: error.message,
		});
	}
};

exports.getPaymentDetails = async (req, res) => {
	try {
		const { payment_id } = req.query;
		const user_id = req.userId;

		// Validate input
		if (!payment_id) {
			return res.status(400).json({
				success: false,
				message: "Payment id is required.",
			});
		}

		// Fetch the payment details with user and order information
		const payment = await Payment.findOne({
			where: { payment_id, user_id },
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"],
				},
				{
					model: Order,
					as: "order_details",
				},
			],
		});

		if (!payment) {
			return res.status(400).json({
				success: false,
				message: "Payment details not found.",
			});
		}

		const findCartItems = payment.order_details.order_items;

		// Fetch cart items related to the order
		const cartItems = await Cart.findAll({
			where: {
				cart_id: { [Op.in]: findCartItems },
			},
			include: [
				{
					model: Product,
					as: "product_details",
				},
			],
		});

		const data = JSON.parse(JSON.stringify(payment));
		data.cart_details = cartItems;

		return res.status(200).json({
			success: true,
			message: "Payment fetched successfully!",
			data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch payment",
			error: error.message,
		});
	}
};

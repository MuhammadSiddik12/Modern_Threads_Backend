const { Op } = require("sequelize");
const Cart = require("../../models/cart");
const Payment = require("../../models/payment");
const Order = require("../../models/order");
const User = require("../../models/user");

exports.getAllPayments = async (req, res) => {
	try {
		// Fetch all orders
		const payment = await Payment.findAll({
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
			message: "Payment fetched successfully!",
			data: payment,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch payment",
			error: error.message,
		});
	}
};

exports.getPaymentDetails = async (req, res) => {
	try {
		const { payment_id } = req.query; // Extract payment ID from the request query

		// Validate Inputs
		if (!payment_id) {
			return res.status(400).json({
				success: false,
				message: "Payment id is required.",
			});
		}

		const payment = await Payment.findOne({
			where: {
				payment_id: payment_id,
			},
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"],
				},
				{
					model: Order,
				},
			],
		});

		if (!payment) {
			return res.status(400).json({
				success: false,
				message: "payment details not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Payment fetched successfully!",
			data: payment,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch payment",
			error: error.message,
		});
	}
};

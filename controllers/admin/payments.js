const { Op } = require("sequelize");
const Cart = require("../../models/cart");
const Payment = require("../../models/payment");
const Order = require("../../models/order");
const User = require("../../models/user");

exports.getAllPayments = async (req, res) => {
	try {
		const { page, limit, search } = req.query;

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch payments with pagination and search
		const payments = await Payment.findAll({
			where: {
				[Op.or]: [
					{
						transaction_id: {
							[Op.like]: `%${search}%`, // Search by transaction ID
						},
					},
					{
						order_id: {
							[Op.like]: `%${search}%`, // Search by order ID
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

		// Fetch total count of payments for pagination
		const totalPaymentsCount = await Payment.count({
			where: {
				[Op.or]: [
					{
						transaction_id: {
							[Op.like]: `%${search}%`, // Search by transaction ID
						},
					},
					{
						order_id: {
							[Op.like]: `%${search}%`, // Search by order ID
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
		});

		return res.status(200).json({
			success: true,
			message: "Payments fetched successfully!",
			data: payments,
			total_count: Math.ceil(totalPaymentsCount / pageSize), // Total number of pages
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
		const { payment_id } = req.query; // Extract payment ID from the request query

		// Validate input
		if (!payment_id) {
			return res.status(400).json({
				success: false,
				message: "Payment ID is required.",
			});
		}

		// Fetch payment details
		const payment = await Payment.findOne({
			where: { payment_id },
			include: [
				{
					model: User,
					as: "user_details",
					attributes: ["user_id", "first_name", "last_name", "email"], // Include user details
				},
				{
					model: Order, // Include related order details
					as: "order_details",
				},
			],
		});

		if (!payment) {
			return res.status(404).json({
				success: false,
				message: "Payment details not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Payment details fetched successfully!",
			data: payment,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch payment details",
			error: error.message,
		});
	}
};

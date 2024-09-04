const Order = require("../../models/order");

exports.getAllOrders = async (req, res) => {
	try {
		// Fetch all users
		const orders = await Order.findAll();

		return res.status(200).json({
			success: true,
			message: "Order fetched successfully!",
			data: orders,
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
		const { order_id } = req.query; // Extract user ID from the request query

		// Validate Inputs
		if (!order_id) {
			return res.status(400).json({
				success: false,
				message: "Order id is required.",
			});
		}

		// Fetch the user by ID
		const order = await Order.findOne({
			where: { order_id },
		});

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Order fetched successfully!",
			data: order,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch order",
			error: error.message,
		});
	}
};

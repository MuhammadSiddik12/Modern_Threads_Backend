const { Op } = require("sequelize");
const User = require("../../models/user");

exports.getAllUsers = async (req, res) => {
	try {
		// Fetch all users

		const { page, limit, search } = req.query;
		// Fetch all categories

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		const users = await User.findAll({
			where: {
				first_name: {
					[Op.like]: `%${search}%`, // Search by category name (case insensitive)
				},
			},
			limit: pageSize, // Number of items per page
			offset: (pageNumber - 1) * pageSize, // Calculate offset for pagination
		});

		const total_users = await User.findAll({
			where: {
				first_name: {
					[Op.like]: `%${search}%`, // Search by category name (case insensitive)
				},
				last_name: {
					[Op.like]: `%${search}%`, // Search by category name (case insensitive)
				},
				email: {
					[Op.like]: `%${search}%`, // Search by category name (case insensitive)
				},
			},
		});

		return res.status(200).json({
			success: true,
			message: "Users fetched successfully!",
			data: users,
			total_count: Math.ceil(total_users.length / parseInt(limit, 10)),
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch user",
			error: error.message,
		});
	}
};

exports.getUserDetails = async (req, res) => {
	try {
		const { user_id } = req.query; // Extract user ID from the request query

		// Validate Inputs
		if (!user_id) {
			return res.status(400).json({
				success: false,
				message: "User id is required.",
			});
		}

		// Fetch the user by ID
		const Users = await User.findOne({
			where: { user_id },
		});

		if (!Users) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "User fetched successfully!",
			data: Users,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch user",
			error: error.message,
		});
	}
};

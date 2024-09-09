const { Op } = require("sequelize");
const User = require("../../models/user");

exports.getAllUsers = async (req, res) => {
	try {
		const { page, limit, search } = req.query;

		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;

		// Fetch users with pagination and search
		const users = await User.findAll({
			where: {
				[Op.or]: [
					{
						first_name: {
							[Op.like]: `%${search}%`, // Search by first name
						},
					},
					{
						last_name: {
							[Op.like]: `%${search}%`, // Search by last name
						},
					},
					{
						email: {
							[Op.like]: `%${search}%`, // Search by email
						},
					},
				],
			},
			limit: pageSize, // Number of items per page
			offset: (pageNumber - 1) * pageSize, // Calculate offset for pagination
		});

		// Fetch total count of users for pagination
		const totalUsersCount = await User.count({
			where: {
				[Op.or]: [
					{
						first_name: {
							[Op.like]: `%${search}%`, // Search by first name
						},
					},
					{
						last_name: {
							[Op.like]: `%${search}%`, // Search by last name
						},
					},
					{
						email: {
							[Op.like]: `%${search}%`, // Search by email
						},
					},
				],
			},
		});

		return res.status(200).json({
			success: true,
			message: "Users fetched successfully!",
			data: users,
			total_count: Math.ceil(totalUsersCount / pageSize), // Total number of pages
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch users",
			error: error.message,
		});
	}
};

exports.getUserDetails = async (req, res) => {
	try {
		const { user_id } = req.query;

		// Validate input
		if (!user_id) {
			return res.status(400).json({
				success: false,
				message: "User ID is required.",
			});
		}

		// Fetch the user by ID
		const user = await User.findOne({
			where: { user_id },
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "User fetched successfully!",
			data: user,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch user",
			error: error.message,
		});
	}
};

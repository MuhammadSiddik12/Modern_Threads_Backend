const User = require("../../models/user");

exports.getAllUsers = async (req, res) => {
	try {
		// Fetch all users
		const users = await User.findAll();

		return res.status(200).json({
			success: true,
			message: "Users fetched successfully!",
			data: users,
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

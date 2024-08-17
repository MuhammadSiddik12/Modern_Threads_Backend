const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

exports.userRegister = async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;
		console.log("🚀 ~ exports.userRegister= ~ req.body:", req.body);

		// Validate inputs
		if (!first_name || !last_name || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		// Check if the user already exists
		const existingUser = await Users.findOne({ where: { email } });
		if (existingUser) {
			return res
				.status(400)
				.json({ success: false, message: "Email already registered" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-6);

		// Create user record
		const newUser = await Users.create({
			user_id: `user${lastSixDigits}`,
			first_name,
			last_name,
			email,
			password: hashedPassword,
		});

		const data = JSON.parse(JSON.stringify(newUser));
		delete data.password;

		// Send confirmation email (using nodemailer)

		const token = jwt.sign(
			{ userId: newUser.user_id },
			process.env.JWT_SECRET,
			{
				expiresIn: "24h",
			}
		);

		return res.status(201).json({
			success: true,
			message: "User registered successfully!",
			token: token,
			data: data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Registration failed",
			error: error.message,
		});
	}
};

exports.userLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate inputs
		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "Email and password are required" });
		}

		// Find the user
		const user = await Users.findOne({ where: { email } });
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Email not found" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ success: false, message: "Password incorrect" });
		}

		// Generate a session token (JWT)
		const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		const data = JSON.parse(JSON.stringify(user));
		delete data.password;
		delete data.forget_otp;

		return res.status(200).json({
			success: true,
			message: "User login successfully!",
			token: token,
			data: data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Login failed",
			error: error.message,
		});
	}
};

exports.getUserDetails = async (req, res) => {
	try {
		const { userId } = req;

		// Find the user by user_id, excluding the password
		const user = await Users.findOne({
			where: { user_id: userId },
			attributes: { exclude: ["password", "forget_otp"] },
		});

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		return res
			.status(200)
			.json({ success: true, message: "User details fetched!", data: user });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve user details",
			error: error.message,
		});
	}
};

exports.editUserProfile = async (req, res) => {
	try {
		const { userId } = req;

		const {
			first_name,
			last_name,
			profile_pic,
			street,
			city,
			state,
			zip_code,
			country,
		} = req.body;

		// Find the user by user_id
		const user = await Users.findOne({
			where: { user_id: userId },
			attributes: { exclude: ["password", "forget_otp"] },
		});

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// Update user details
		user.first_name = first_name || user.first_name;
		user.last_name = last_name || user.last_name;
		user.profile_pic = profile_pic || user.profile_pic;
		user.street = street || user.street;
		user.city = city || user.city;
		user.state = state || user.state;
		user.zip_code = zip_code || user.zip_code;
		user.country = country || user.country;

		// Save the updated user details
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: user,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update user profile",
			error: error.message,
		});
	}
};

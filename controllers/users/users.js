const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../../models/user");

exports.userRegister = async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;
		console.log("🚀 ~ exports.userRegister= ~ req.body:", req.body);

		// Validate input fields
		if (!first_name || !last_name || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		// Check if the email is already registered
		const existingUser = await Users.findOne({ where: { email } });
		if (existingUser) {
			return res
				.status(400)
				.json({ success: false, message: "Email already registered" });
		}

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate a unique user ID
		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-6);

		// Create a new user record
		const newUser = await Users.create({
			user_id: `user${lastSixDigits}`,
			first_name,
			last_name,
			email,
			password: hashedPassword,
			phone_number,
		});

		const data = JSON.parse(JSON.stringify(newUser));
		delete data.password; // Remove sensitive data from response

		// Generate JWT token
		const token = jwt.sign(
			{ userId: newUser.user_id },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
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

		// Validate input fields
		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "Email and password are required" });
		}

		// Find the user by email
		const user = await Users.findOne({ where: { email } });
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Email not found" });
		}

		// Check if the provided password matches the stored hashed password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ success: false, message: "Password incorrect" });
		}

		// Generate JWT token
		const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		const data = JSON.parse(JSON.stringify(user));
		delete data.password; // Remove sensitive data from response
		delete data.forget_otp; // Remove any other sensitive data

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

		// Find the user by user ID and exclude sensitive fields
		const user = await Users.findOne({
			where: { user_id: userId },
			attributes: { exclude: ["password", "forget_otp"] },
		});

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		return res.status(200).json({
			success: true,
			message: "User details fetched!",
			data: user,
		});
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
			phone_number,
		} = req.body;

		// Find the user by user ID
		const user = await Users.findOne({
			where: { user_id: userId },
			attributes: { exclude: ["password", "forget_otp"] },
		});

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// Update user details with provided data
		user.first_name = first_name || user.first_name;
		user.last_name = last_name || user.last_name;
		user.profile_pic = profile_pic || user.profile_pic;
		user.street = street || user.street;
		user.city = city || user.city;
		user.state = state || user.state;
		user.zip_code = zip_code || user.zip_code;
		user.country = country || user.country;
		user.phone_number = phone_number || user.phone_number;

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

const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

exports.adminSignup = async (req, res) => {
	try {
		const { admin_name, admin_email, admin_password } = req.body;

		// Validate Inputs
		if (!admin_name || !admin_email || !admin_password) {
			return res.status(400).json({
				success: false,
				message: "All fields (name, email, password) are required",
			});
		}

		// Check if the admin already exists
		const existingAdmin = await Admin.findOne({ where: { admin_email } });
		if (existingAdmin) {
			return res.status(409).json({
				success: false,
				message: "Admin with this email already exists",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(admin_password, 10);

		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-5);

		// Create new Admin record
		const newAdmin = await Admin.create({
			admin_id: `admin${lastSixDigits}`,
			admin_name,
			admin_email,
			admin_password: hashedPassword,
		});

		const data = JSON.parse(JSON.stringify(newAdmin));
		delete data.admin_password;

		const token = jwt.sign(
			{ adminId: data.admin_id },
			process.env.JWT_SECRET_ADMIN,
			{
				expiresIn: "24h",
			}
		);

		return res.status(201).json({
			success: true,
			message: "Admin registered successfully!",
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

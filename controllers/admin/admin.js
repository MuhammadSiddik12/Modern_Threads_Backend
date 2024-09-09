const bcrypt = require("bcryptjs");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Payment = require("../../models/payment");
const Product = require("../../models/product");
const Order = require("../../models/order");
const Category = require("../../models/category");

exports.adminSignup = async (req, res) => {
	try {
		const { admin_name, admin_email, admin_password } = req.body;

		// Validate input fields
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

		// Generate a unique admin ID
		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-5);

		// Create a new admin record
		const newAdmin = await Admin.create({
			admin_id: `admin${lastSixDigits}`,
			admin_name,
			admin_email,
			admin_password: hashedPassword,
		});

		const data = JSON.parse(JSON.stringify(newAdmin));
		delete data.admin_password; // Remove sensitive data

		// Generate JWT token
		const token = jwt.sign(
			{ adminId: data.admin_id },
			process.env.JWT_SECRET_ADMIN,
			{ expiresIn: "24h" }
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

exports.adminLogin = async (req, res) => {
	try {
		const { admin_email, admin_password } = req.body;

		// Validate input fields
		if (!admin_email || !admin_password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		// Find admin by email
		const admin = await Admin.findOne({ where: { admin_email } });

		if (!admin) {
			return res.status(404).json({
				success: false,
				message: "Admin not found",
			});
		}

		// Verify password
		const validPassword = await bcrypt.compare(
			admin_password,
			admin.admin_password
		);

		if (!validPassword) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{ adminId: admin.admin_id },
			process.env.JWT_SECRET_ADMIN,
			{ expiresIn: "24h" }
		);

		const data = JSON.parse(JSON.stringify(admin));
		delete data.admin_password; // Remove sensitive data

		return res.status(200).json({
			success: true,
			message: "Login successful",
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

exports.editAdminProfile = async (req, res) => {
	try {
		const { adminId } = req;

		const { admin_name } = req.body;

		// Find the admin by ID
		const admin = await Admin.findOne({
			where: { admin_id: adminId },
			attributes: { exclude: ["admin_password"] },
		});

		if (!admin) {
			return res
				.status(404)
				.json({ success: false, message: "Admin not found" });
		}

		// Update admin details
		admin.admin_name = admin_name || admin.admin_name;

		// Save updated admin details
		await admin.save();

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: admin,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update admin profile",
			error: error.message,
		});
	}
};

exports.getAdminDetails = async (req, res) => {
	try {
		const { adminId } = req;

		// Find the admin by ID, excluding the password
		const admin = await Admin.findOne({
			where: { admin_id: adminId },
			attributes: { exclude: ["admin_password"] },
		});

		if (!admin) {
			return res
				.status(404)
				.json({ success: false, message: "Admin not found" });
		}

		return res.status(200).json({
			success: true,
			message: "Admin details fetched!",
			data: admin,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve admin details",
			error: error.message,
		});
	}
};

exports.dashboardDetails = async (req, res) => {
	try {
		const { adminId } = req;

		// Find the admin by ID, excluding the password
		const admin = await Admin.findOne({
			where: { admin_id: adminId },
			attributes: { exclude: ["admin_password"] },
		});

		if (!admin) {
			return res
				.status(404)
				.json({ success: false, message: "Admin not found" });
		}

		// Fetch statistics for dashboard
		const users = await User.count();
		const products = await Product.count();
		const orders = await Order.count();
		const payments = await Payment.count();
		const categories = await Category.count();

		return res.status(200).json({
			success: true,
			message: "Admin dashboard fetched!",
			data: {
				totalUsers: users,
				totalProducts: products,
				totalOrders: orders,
				totalPayments: payments,
				totalCategories: categories,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve dashboard details",
			error: error.message,
		});
	}
};

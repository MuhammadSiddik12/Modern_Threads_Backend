const { Op } = require("sequelize");
const Payments = require("../../models/payment");
const Order = require("../../models/order");
const Product = require("../../models/product");
const User = require("../../models/user");
const Category = require("../../models/category");
const Reports = require("../../models/report");
const Cart = require("../../models/cart");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

// Generate report based on the report type
exports.generateReport = async (req, res) => {
	try {
		const { report_type } = req.body; // Extract report type from request body

		// Generate a unique file name for the report
		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-4);

		const fileName = `report-${report_type}-${lastSixDigits}.csv`;
		const filePath = path.join(__dirname + "../../../", "reports", fileName);

		let records = [];
		let header = [];

		// Generate report for users
		if (report_type == "users") {
			const findAllUsers = await User.findAll();

			records = findAllUsers;
			header = [
				{ id: "user_id", title: "userId" },
				{ id: "first_name", title: "First Name" },
				{ id: "last_name", title: "Last Name" },
				{ id: "phone_number", title: "Phone Number" },
				{ id: "email", title: "Email" },
				{ id: "profile_pic", title: "Profile Pic" },
				{ id: "created_at", title: "Creation Date" },
				{ id: "street", title: "Street" },
				{ id: "city", title: "City" },
				{ id: "state", title: "State" },
				{ id: "zip_code", title: "Zip Code" },
				{ id: "country", title: "Country" },
			];
		}
		// Generate report for products
		else if (report_type == "products") {
			const findAllProducts = await Product.findAll({
				include: {
					model: Category, // Include associated category
				},
			});

			// Flatten the records to include necessary fields
			const flattenedRecords = findAllProducts.map((record) => ({
				product_id: record.product_id,
				product_name: record.product_name,
				description: record.description,
				price: record.price,
				category_id: record.category_id,
				stock_quantity: record.stock_quantity,
				product_images: record.product_images,
				category_name: record.Category.category_name,
				created_at: record.created_at,
			}));

			records = flattenedRecords;
			header = [
				{ id: "product_id", title: "productId" },
				{ id: "product_name", title: "Product Name" },
				{ id: "description", title: "Description" },
				{ id: "price", title: "Price" },
				{ id: "category_id", title: "CategoryId" },
				{ id: "stock_quantity", title: "Stock Quantity" },
				{ id: "product_images", title: "Product Images" },
				{ id: "category_name", title: "Category Name" },
				{ id: "created_at", title: "Creation Date" },
			];
		}
		// Generate report for categories
		else if (report_type == "categories") {
			const findAllCategory = await Category.findAll();

			records = findAllCategory;
			header = [
				{ id: "category_id", title: "categoryId" },
				{ id: "category_name", title: "Category Name" },
				{ id: "category_image", title: "Category Image" },
				{ id: "created_at", title: "Creation Date" },
			];
		}
		// Generate report for orders
		else if (report_type == "orders") {
			const findAllOrder = await Order.findAll({
				include: [
					{
						model: User,
						as: "user_details",
						attributes: ["user_id", "first_name", "last_name", "email"], // Include user details
					},
				],
			});

			// Find corresponding cart items for orders
			const cartItems = await Cart.findAll({
				where: {
					cart_id: {
						[Op.in]: findAllOrder.flatMap((e) => e.order_items),
					},
				},
				include: [
					{
						model: Product,
						as: "product_details",
					},
				],
			});

			// Associate cart and product details with orders
			for (let index = 0; index < findAllOrder.length; index++) {
				const element = findAllOrder[index];
				const findCart = cartItems.find((cartItem) =>
					element.order_items.includes(cartItem.cart_id)
				);

				element.cart_details = findCart;
				element.product_details = findCart.product_details;
			}

			// Flatten the records to include necessary fields
			const flattenedRecords = findAllOrder.map((record) => ({
				user_id: record.user_id,
				total_price: record.total_price,
				order_status: record.order_status,
				first_name: record.user_details.first_name, // Flattened user name
				product_name: record.product_details.product_name, // Flattened product name
				created_at: record.created_at,
			}));

			records = flattenedRecords;
			header = [
				{ id: "user_id", title: "userId" },
				{ id: "total_price", title: "Total Price" },
				{ id: "order_status", title: "Order Status" },
				{ id: "first_name", title: "Name" },
				{ id: "product_name", title: "Product Name" },
				{ id: "created_at", title: "Creation Date" },
			];
		}
		// Generate report for payments
		else if (report_type == "payments") {
			const findAllPayments = await Payments.findAll();

			records = findAllPayments;
			header = [
				{ id: "payment_id", title: "paymentId" },
				{ id: "order_id", title: "orderId" },
				{ id: "user_id", title: "userId" },
				{ id: "payment_method", title: "Payment method" },
				{ id: "amount", title: "Amount" },
				{ id: "payment_status", title: "Payment Status" },
				{ id: "created_at", title: "Creation Date" },
				{ id: "transaction_id", title: "Transaction Id" },
			];
		}
		// Invalid report type
		else {
			return res.status(400).json({
				success: false,
				message:
					"report type must be users, products, categories, orders, or payments",
			});
		}

		// Write the CSV file
		const csvWriter = createObjectCsvWriter({
			path: filePath,
			header: header,
		});

		await csvWriter.writeRecords(records); // Save the records to the CSV file

		// Save the report details to the database
		await Reports.create({
			report_id: `report${lastSixDigits}`,
			report_type,
			report_url: `/reports/${fileName}`,
		});

		return res
			.status(200)
			.json({ success: true, fileUrl: `/reports/${fileName}` }); // Return file URL
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to generate reports",
			error: error.message,
		});
	}
};

// Get all reports
exports.getAllReports = async (req, res) => {
	try {
		const findReports = await Reports.findAll({}); // Fetch all reports from the database

		return res.status(200).json({
			success: true,
			message: "Reports fetched successfully!",
			data: findReports,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch reports",
			error: error.message,
		});
	}
};

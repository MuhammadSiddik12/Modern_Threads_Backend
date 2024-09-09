const { sequelize, DataTypes } = require("../utils/sequelize"); // Import sequelize instance and DataTypes

// Define the Order model
const Order = sequelize.define(
	"Order",
	{
		order_id: {
			type: DataTypes.STRING(15), // Data type and length for order ID
			primaryKey: true, // Define order_id as the primary key
		},
		user_id: {
			type: DataTypes.STRING(30), // Data type and length for user ID
			references: {
				model: "users", // Reference to the User model
				key: "user_id", // Foreign key in the User model
			},
		},
		total_price: {
			type: DataTypes.STRING(30), // Data type and length for total price
			allowNull: false, // Total price is required
		},
		order_status: {
			type: DataTypes.STRING(10), // Data type and length for order status
			defaultValue: "Pending", // Default value is "Pending"
		},
		shipping_address: {
			type: DataTypes.JSON(), // Data type for shipping address (JSON format)
			allowNull: false, // Shipping address is required
		},
		billing_address: {
			type: DataTypes.JSON(), // Data type for billing address (JSON format)
			allowNull: false, // Billing address is required
		},
		order_items: {
			type: DataTypes.JSONB(DataTypes.STRING), // Data type for order items (JSONB format)
			allowNull: false, // Order items are required
		},
		created_at: {
			type: DataTypes.DATE, // Data type for creation timestamp
			allowNull: false, // Creation timestamp is required
			defaultValue: DataTypes.NOW, // Default value is current date and time
		},
		updated_at: {
			type: DataTypes.DATE, // Data type for last update timestamp
			allowNull: false, // Update timestamp is required
			defaultValue: DataTypes.NOW, // Default value is current date and time
		},
	},
	{
		tableName: "orders", // Table name in the database
		timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
	}
);

module.exports = Order; // Export the Order model for use in other modules

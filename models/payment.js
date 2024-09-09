const { sequelize, DataTypes } = require("../utils/sequelize"); // Import sequelize instance and DataTypes

// Define the Payment model
const Payment = sequelize.define(
	"Payment",
	{
		payment_id: {
			type: DataTypes.STRING(15), // Data type and length for payment ID
			primaryKey: true, // Define payment_id as the primary key
		},
		order_id: {
			type: DataTypes.STRING(30), // Data type and length for order ID
			references: {
				model: "orders", // Reference to the Order model
				key: "order_id", // Foreign key in the Order model
			},
		},
		user_id: {
			type: DataTypes.STRING(30), // Data type and length for user ID
			references: {
				model: "users", // Reference to the User model
				key: "user_id", // Foreign key in the User model
			},
		},
		payment_method: {
			type: DataTypes.STRING(10), // Data type and length for payment method
			allowNull: false, // Payment method is required
		},
		amount: {
			type: DataTypes.DOUBLE, // Data type for payment amount
			allowNull: false, // Amount is required
		},
		payment_status: {
			type: DataTypes.STRING(10), // Data type and length for payment status
			defaultValue: "pending", // Default value is "pending"
		},
		transaction_id: {
			type: DataTypes.STRING(100), // Data type and length for transaction ID
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
		tableName: "payments", // Table name in the database
		timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
	}
);

module.exports = Payment; // Export the Payment model for use in other modules

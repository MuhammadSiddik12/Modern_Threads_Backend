const { sequelize, DataTypes } = require("../utils/sequelize"); // Import sequelize instance and DataTypes

// Define the Cart model
const Cart = sequelize.define(
	"Cart",
	{
		cart_id: {
			type: DataTypes.STRING(10), // Data type and length for cart ID
			primaryKey: true, // Define cart_id as the primary key
		},
		product_id: {
			type: DataTypes.STRING(30), // Data type and length for product ID
			allowNull: false, // Product ID is required
			references: {
				model: "products", // Reference to the 'products' table
				key: "product_id", // Key in the 'products' table
			},
		},
		price: {
			type: DataTypes.STRING(30), // Data type and length for price
			allowNull: false, // Price is required
		},
		quantity: {
			type: DataTypes.INTEGER, // Data type for quantity
			allowNull: false, // Quantity is required
		},
		user_id: {
			type: DataTypes.STRING(30), // Data type and length for user ID
			references: {
				model: "users", // Reference to the 'users' table
				key: "user_id", // Key in the 'users' table
			},
		},
		order_created: {
			type: DataTypes.BOOLEAN, // Data type for order_created flag
			defaultValue: false, // Default value is false
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
		tableName: "carts", // Table name in the database
		timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
	}
);

module.exports = Cart; // Export the Cart model for use in other modules

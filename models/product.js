const { sequelize, DataTypes } = require("../utils/sequelize"); // Import sequelize instance and DataTypes

// Define the Product model
const Product = sequelize.define(
	"Product",
	{
		product_id: {
			type: DataTypes.STRING(10), // Data type and length for product ID
			primaryKey: true, // Define product_id as the primary key
		},
		product_name: {
			type: DataTypes.STRING(100), // Data type and length for product name
			allowNull: false, // Product name is required
		},
		description: {
			type: DataTypes.STRING(1000), // Data type and length for product description
		},
		price: {
			type: DataTypes.STRING(10), // Data type and length for product price
			allowNull: false, // Price is required
		},
		category_id: {
			type: DataTypes.STRING(10), // Data type and length for category ID
			allowNull: false, // Category ID is required
			references: {
				model: "categories", // Reference to the Category model
				key: "category_id", // Foreign key in the Category model
			},
		},
		stock_quantity: {
			type: DataTypes.INTEGER, // Data type for stock quantity
			defaultValue: 1, // Default stock quantity
		},
		product_images: {
			type: DataTypes.JSON(), // Data type for product images (stored as JSON)
			allowNull: false, // Product images are required
		},
		status: {
			type: DataTypes.STRING(10), // Data type and length for product status
			defaultValue: "active", // Default status is "active"
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
		tableName: "products", // Table name in the database
		timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
	}
);

module.exports = Product; // Export the Product model for use in other modules

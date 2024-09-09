const { sequelize, DataTypes } = require("../utils/sequelize"); // Import sequelize instance and DataTypes

// Define the Category model
const Category = sequelize.define(
	"Category",
	{
		category_id: {
			type: DataTypes.STRING(10), // Data type and length for category ID
			primaryKey: true, // Define category_id as the primary key
		},
		category_name: {
			type: DataTypes.STRING(30), // Data type and length for category name
			allowNull: false, // Category name is required
		},
		category_image: {
			type: DataTypes.STRING(100), // Data type and length for category image URL
			allowNull: true, // Category image is optional
		},
		status: {
			type: DataTypes.STRING(10), // Data type and length for status
			defaultValue: "active", // Default value is "active"
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
		tableName: "categories", // Table name in the database
		timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
	}
);

module.exports = Category; // Export the Category model for use in other modules

const { sequelize, DataTypes } = require("../utils/sequelize"); // Import sequelize instance and DataTypes

// Define the Admin model
const Admin = sequelize.define(
	"Admin",
	{
		admin_id: {
			type: DataTypes.STRING(10), // Data type and length for admin ID
			primaryKey: true, // Define admin_id as the primary key
		},
		admin_name: {
			type: DataTypes.STRING(30), // Data type and length for admin name
			allowNull: false, // Name is required
		},
		admin_email: {
			type: DataTypes.STRING(30), // Data type and length for admin email
			allowNull: false, // Email is required
			// unique: true, // Uncomment if email should be unique
		},
		admin_password: {
			type: DataTypes.STRING(100), // Data type and length for admin password
			allowNull: false, // Password is required
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
		tableName: "admins", // Table name in the database
		timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
	}
);

module.exports = Admin; // Export the Admin model for use in other modules

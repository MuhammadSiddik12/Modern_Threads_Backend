const { sequelize, DataTypes } = require("../utils/sequelize"); // Import sequelize instance and DataTypes

// Define the Report model
const Report = sequelize.define(
	"Report",
	{
		report_id: {
			type: DataTypes.STRING(10), // Data type and length for report ID
			primaryKey: true, // Define report_id as the primary key
		},
		report_type: {
			type: DataTypes.STRING(30), // Data type and length for report type
			allowNull: false, // Report type is required
		},
		report_url: {
			type: DataTypes.STRING(30), // Data type and length for report URL
			allowNull: false, // Report URL is required
		},
		status: {
			type: DataTypes.STRING(10), // Data type and length for report status
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
		tableName: "reports", // Table name in the database
		timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
	}
);

module.exports = Report; // Export the Report model for use in other modules

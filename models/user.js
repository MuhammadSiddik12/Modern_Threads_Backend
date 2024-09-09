const { sequelize, DataTypes } = require("../utils/sequelize"); // Import sequelize instance and DataTypes

// Define the User model
const User = sequelize.define(
	"User",
	{
		user_id: {
			type: DataTypes.STRING(12), // Data type and length for user ID
			primaryKey: true, // Define user_id as the primary key
		},
		first_name: {
			type: DataTypes.STRING(30), // Data type and length for first name
		},
		last_name: {
			type: DataTypes.STRING(30), // Data type and length for last name
		},
		phone_number: {
			type: DataTypes.STRING(15), // Data type and length for phone number
		},
		email: {
			type: DataTypes.STRING(50), // Data type and length for email
			allowNull: false, // Email is required
			// unique: true, // Uncomment to enforce unique email addresses
		},
		password: {
			type: DataTypes.STRING(80), // Data type and length for password
			allowNull: false, // Password is required
		},
		profile_pic: {
			type: DataTypes.STRING(100), // Data type and length for profile picture URL
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
		street: {
			type: DataTypes.STRING(50), // Data type and length for street address
		},
		city: {
			type: DataTypes.STRING(30), // Data type and length for city
		},
		state: {
			type: DataTypes.STRING(50), // Data type and length for state
		},
		zip_code: {
			type: DataTypes.STRING(10), // Data type and length for zip code
		},
		country: {
			type: DataTypes.STRING(20), // Data type and length for country
		},
		forget_otp: {
			type: DataTypes.STRING(10), // Data type and length for forgot password OTP
		},
		status: {
			type: DataTypes.STRING(10), // Data type and length for user status
			defaultValue: "active", // Default status is "active"
		},
	},
	{
		tableName: "users", // Table name in the database
		timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
	}
);

module.exports = User; // Export the User model for use in other modules

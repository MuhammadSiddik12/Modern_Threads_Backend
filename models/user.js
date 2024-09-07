const { sequelize, DataTypes } = require("../utils/sequelize");

const User = sequelize.define(
	"User",
	{
		user_id: {
			type: DataTypes.STRING(12),
			primaryKey: true,
		},
		first_name: {
			type: DataTypes.STRING(30),
		},
		last_name: {
			type: DataTypes.STRING(30),
		},
		phone_number: {
			type: DataTypes.STRING(15),
		},
		email: {
			type: DataTypes.STRING(50),
			allowNull: false,
			// unique: true,
		},
		password: {
			type: DataTypes.STRING(80),
			allowNull: false,
		},
		profile_pic: {
			type: DataTypes.STRING(100),
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		street: {
			type: DataTypes.STRING(50),
		},
		city: {
			type: DataTypes.STRING(30),
		},
		state: {
			type: DataTypes.STRING(50),
		},
		zip_code: {
			type: DataTypes.STRING(10),
		},
		country: {
			type: DataTypes.STRING(20),
		},
		forget_otp: {
			type: DataTypes.STRING(10),
		},
		status: {
			type: DataTypes.STRING(10),
			defaultValue: "active",
		},
	},
	{
		tableName: "users",
		timestamps: false,
	}
);

module.exports = User;

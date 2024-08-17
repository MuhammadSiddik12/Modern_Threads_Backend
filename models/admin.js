const { sequelize, DataTypes } = require("../utils/sequelize");

const Admin = sequelize.define(
	"Admin",
	{
		admin_id: {
			type: DataTypes.STRING(10),
			primaryKey: true,
		},
		admin_name: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		admin_email: {
			type: DataTypes.STRING(30),
			allowNull: false,
			unique: true,
		},
		admin_password: {
			type: DataTypes.STRING(10),
			allowNull: false,
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
	},
	{
		tableName: "admins",
		timestamps: false,
	}
);

module.exports = Admin;

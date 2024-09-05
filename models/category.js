const { sequelize, DataTypes } = require("../utils/sequelize");

const Category = sequelize.define(
	"Category",
	{
		category_id: {
			type: DataTypes.STRING(10),
			primaryKey: true,
		},
		category_name: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		category_image: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		status: {
			type: DataTypes.STRING(10),
			defaultValue: "active",
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
		tableName: "categories",
		timestamps: false,
	}
);

module.exports = Category;

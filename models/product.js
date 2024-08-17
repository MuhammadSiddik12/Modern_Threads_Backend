const { sequelize, DataTypes } = require("../utils/sequelize");

const Product = sequelize.define(
	"Product",
	{
		product_id: {
			type: DataTypes.STRING(10),
			primaryKey: true,
		},
		product_name: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(100),
		},
		price: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		category_id: {
			type: DataTypes.STRING(10),
			allowNull: false,
			references: {
				model: "categories",
				key: "category_id",
			},
		},
		stock_quantity: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
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
		tableName: "products",
		timestamps: false,
	}
);

module.exports = Product;

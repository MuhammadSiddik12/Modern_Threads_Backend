const { sequelize, DataTypes } = require("../utils/sequelize");

const Order = sequelize.define(
	"Order",
	{
		order_id: {
			type: DataTypes.STRING(15),
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.STRING(30),
			references: {
				model: "users",
				key: "user_id",
			},
		},
		total_price: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		order_status: {
			type: DataTypes.STRING(10),
			defaultValue: "Pending",
		},
		shipping_address: {
			type: DataTypes.JSON(),
			allowNull: false,
		},
		billing_address: {
			type: DataTypes.JSON(),
			allowNull: false,
		},
		order_items: {
			type: DataTypes.JSON(DataTypes.STRING),
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
		tableName: "orders",
		timestamps: false,
	}
);

module.exports = Order;

const { sequelize, DataTypes } = require("../utils/sequelize");

const Payment = sequelize.define(
	"Payment",
	{
		payment_id: {
			type: DataTypes.STRING(10),
			primaryKey: true,
		},
		order_id: {
			type: DataTypes.STRING(30),
			references: {
				model: "orders",
				key: "order_id",
			},
		},
		user_id: {
			type: DataTypes.STRING(30),
			references: {
				model: "users",
				key: "user_id",
			},
		},
		payment_method: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		amount: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		payment_status: {
			type: DataTypes.STRING(10),
			defaultValue: "pending",
		},
		transaction_id: {
			type: DataTypes.STRING(30),
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
		tableName: "payments",
		timestamps: false,
	}
);

module.exports = Payment;

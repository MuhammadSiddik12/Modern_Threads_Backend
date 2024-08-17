const { sequelize, DataTypes } = require("../utils/sequelize");

const Cart = sequelize.define(
	"Cart",
	{
		cart_id: {
			type: DataTypes.STRING(10),
			primaryKey: true,
		},
		product_id: {
			type: DataTypes.STRING(30),
			allowNull: false,
			references: {
				model: "products",
				key: "product_id",
			},
		},
		price: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.STRING(30),
			references: {
				model: "users",
				key: "user_id",
			},
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
		tableName: "carts",
		timestamps: false,
	}
);

module.exports = Cart;

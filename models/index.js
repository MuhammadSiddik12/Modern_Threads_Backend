const { sequelize } = require("../utils/sequelize");

// models
const User = require("./user");
const Category = require("./category");
const Product = require("./product");
const Cart = require("./cart");
const Order = require("./order");
const Admin = require("./admin");
const Payment = require("./payment");
const Report = require("./report");

// Define associations
Product.belongsTo(Category, {
	foreignKey: "category_id",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Category.hasMany(Product, {
	foreignKey: "category_id",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Cart.belongsTo(Product, {
	as: "product_details",
	foreignKey: "product_id",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Cart.belongsTo(User, { foreignKey: "user_id" });
Order.belongsTo(User, {
	as: "user_details",
	foreignKey: "user_id",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Payment.belongsTo(User, {
	as: "user_details",
	foreignKey: "user_id",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
User.hasMany(Payment, {
	as: "payment_details",
	foreignKey: "user_id",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Payment.belongsTo(Order, {
	foreignKey: "order_id",
	as: "order_details", // Alias must match the query
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Order.hasMany(Payment, {
	foreignKey: "order_id",
	as: "payment_details",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

// Sync all models
// sequelize.sync({ alter: true }).then(() => {
// 	console.log("Database & tables created!");
// });

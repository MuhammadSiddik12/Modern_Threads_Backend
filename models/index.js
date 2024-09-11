const { sequelize } = require("../utils/sequelize"); // Import sequelize instance

// models
const User = require("./user"); // User model
const Category = require("./category"); // Category model
const Product = require("./product"); // Product model
const Cart = require("./cart"); // Cart model
const Order = require("./order"); // Order model
const Admin = require("./admin"); // Admin model
const Payment = require("./payment"); // Payment model
const Report = require("./report"); // Report model

// Define associations

// A product belongs to one category
Product.belongsTo(Category, {
	foreignKey: "category_id", // Foreign key in the Product model
	onDelete: "CASCADE", // Delete products if the associated category is deleted
	onUpdate: "CASCADE", // Update foreign key if the associated category ID changes
});

// A category can have many products
Category.hasMany(Product, {
	foreignKey: "category_id", // Foreign key in the Product model
	onDelete: "CASCADE", // Delete products if the associated category is deleted
	onUpdate: "CASCADE", // Update foreign key if the associated category ID changes
});

// A cart item belongs to one product
Cart.belongsTo(Product, {
	as: "product_details", // Alias for association
	foreignKey: "product_id", // Foreign key in the Cart model
	onDelete: "CASCADE", // Delete cart items if the associated product is deleted
	onUpdate: "CASCADE", // Update foreign key if the associated product ID changes
});

// A cart item belongs to one user
Cart.belongsTo(User, {
	foreignKey: "user_id", // Foreign key in the Cart model
});

// An order belongs to one user
Order.belongsTo(User, {
	as: "user_details", // Alias for association
	foreignKey: "user_id", // Foreign key in the Order model
	onDelete: "CASCADE", // Delete orders if the associated user is deleted
	onUpdate: "CASCADE", // Update foreign key if the associated user ID changes
});

// A payment belongs to one user
Payment.belongsTo(User, {
	as: "user_details", // Alias for association
	foreignKey: "user_id", // Foreign key in the Payment model
	onDelete: "CASCADE", // Delete payments if the associated user is deleted
	onUpdate: "CASCADE", // Update foreign key if the associated user ID changes
});

// A user can have many payments
User.hasMany(Payment, {
	as: "payment_details", // Alias for association
	foreignKey: "user_id", // Foreign key in the Payment model
	onDelete: "CASCADE", // Delete payments if the associated user is deleted
	onUpdate: "CASCADE", // Update foreign key if the associated user ID changes
});

// A payment belongs to one order
Payment.belongsTo(Order, {
	foreignKey: "order_id", // Foreign key in the Payment model
	as: "order_details", // Alias for association, must match the query
	onDelete: "CASCADE", // Delete payments if the associated order is deleted
	onUpdate: "CASCADE", // Update foreign key if the associated order ID changes
});

// An order can have many payments
Order.hasMany(Payment, {
	foreignKey: "order_id", // Foreign key in the Payment model
	as: "payment_details", // Alias for association
	onDelete: "CASCADE", // Delete payments if the associated order is deleted
	onUpdate: "CASCADE", // Update foreign key if the associated order ID changes
});

// Sync all models (uncomment to create or alter database schema)
sequelize.sync({ alter: true }).then(() => {
	console.log("Database & tables created!");
});

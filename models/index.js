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

// Sync all models
sequelize.sync({ alter: true }).then(() => {
	console.log("Database & tables created!");
});

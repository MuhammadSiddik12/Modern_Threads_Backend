const { sequelize } = require("../utils/sequelize");

// models
const User = require("./user");

// Sync all models
// sequelize
// 	.sync({ alter: true })
// 	.then(() => {
// 		console.log("Database & tables created!");
// 	});

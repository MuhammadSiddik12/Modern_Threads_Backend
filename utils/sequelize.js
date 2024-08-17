const { Sequelize, DataTypes } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize("modernThreads", "root", "Siddik@1234", {
	host: "localhost",
	dialect: "mysql",
});

// Test the connection
sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

// Export the Sequelize instance and DataTypes for use in models
module.exports = { sequelize, DataTypes };

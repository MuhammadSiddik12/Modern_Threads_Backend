const { Sequelize, DataTypes } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: "mysql",
	}
);

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

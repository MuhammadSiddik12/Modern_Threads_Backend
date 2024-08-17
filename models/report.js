const { sequelize, DataTypes } = require("../utils/sequelize");

const Report = sequelize.define(
	"Report",
	{
		report_id: {
			type: DataTypes.STRING(10),
			primaryKey: true,
		},
		report_type: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		report_url: {
			type: DataTypes.STRING(30),
			allowNull: false,
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
		tableName: "reports",
		timestamps: false,
	}
);

module.exports = Report;

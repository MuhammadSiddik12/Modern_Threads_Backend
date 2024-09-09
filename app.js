require("dotenv").config({ path: ".env" }); // Load environment variables from .env file
const createError = require("http-errors"); // Middleware for creating HTTP errors
const express = require("express"); // Express framework
const path = require("path"); // Path utility for file paths
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies
const logger = require("morgan"); // HTTP request logger middleware
require("./models/index"); // Import and initialize database models
const cors = require("cors"); // Middleware for enabling CORS
const indexRouter = require("./routes/index"); // Import index route handler

const app = express(); // Create an Express application

// View engine setup
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.set("view engine", "ejs"); // Set the view engine to EJS

app.use(cors()); // Enable CORS
app.use(logger("dev")); // Use logger middleware in development mode
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from the uploads directory

app.use("/", indexRouter); // Use the index router for all routes starting with /

app.use(function (req, res, next) {
	// Handle 404 errors (not found)
	next(createError(404)); // Forward to error handler with 404 status
});

app.use(function (err, req, res, next) {
	// Error handler
	res.locals.message = err.message; // Provide error message to locals
	res.locals.error = req.app.get("env") === "development" ? err : {}; // Provide error details in development

	res.status(err.status || 500); // Set response status
	res.render("error"); // Render the error page
});

module.exports = app; // Export the app for use in other modules

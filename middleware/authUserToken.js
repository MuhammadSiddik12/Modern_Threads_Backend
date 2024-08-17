const jwt = require("jsonwebtoken");

// Middleware to check the JWT token
const authenticateToken = (req, res, next) => {
	// Get the token from the authorization header
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Expecting 'Bearer TOKEN'

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Access denied. No token provided." });
	}

	try {
		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.userId = decoded.userId; // Attach the decoded payload to the request object
		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		return res.status(401).json({ success: false, message: "Invalid token." });
	}
};

module.exports = authenticateToken;

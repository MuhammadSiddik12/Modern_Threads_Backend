const jwt = require("jsonwebtoken");

// Middleware to check the JWT token
const authenticateToken = (req, res, next) => {
	// Get the token from the authorization header
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Expecting 'Bearer TOKEN'

	// If no token is provided, return a 401 Unauthorized error
	if (!token) {
		return res.status(401).json({ success: false, message: "Access denied." });
	}

	try {
		// Verify the token using the secret key from environment variables
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Attach the decoded payload (userId) to the request object for further use
		req.userId = decoded.userId;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		// If token verification fails, return a 401 Unauthorized error
		return res.status(401).json({ success: false, message: "Access denied." });
	}
};

module.exports = authenticateToken;

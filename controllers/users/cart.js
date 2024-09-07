const Cart = require("../../models/cart");
const Product = require("../../models/product");

exports.addToCart = async (req, res) => {
	try {
		const { product_id, quantity } = req.body;

		const user_id = req.userId;

		if (!product_id || !quantity) {
			return res.status(400).json({
				success: false,
				message: "Product id and quantity are required.",
			});
		}

		// Find the product to get the price
		const product = await Product.findOne({ where: { product_id } });

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found.",
			});
		}

		// Find the cart item
		const checkCartItem = await Cart.findOne({
			where: { product_id: product_id },
		});

		if (checkCartItem) {
			return res.status(400).json({
				success: false,
				message: "Product already in cart.",
			});
		}

		let timestamp = Date.now();
		let lastSixDigits = timestamp.toString().slice(-5);

		// Calculate the price based on the quantity
		const price = parseFloat(product.price) * quantity;

		// Create a new cart entry
		const cartItem = await Cart.create({
			cart_id: `cart${lastSixDigits}`, // Unique ID for the cart item
			product_id,
			price: price.toFixed(2), // Store the total price
			quantity,
			user_id,
		});

		return res.status(201).json({
			success: true,
			message: "Product added to cart!",
			data: cartItem,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to add to cart",
			error: error.message,
		});
	}
};

exports.updateCart = async (req, res) => {
	try {
		const { cart_id, quantity } = req.body;

		if (!cart_id || !quantity) {
			return res.status(400).json({
				success: false,
				message: "Cart id and quantity are required.",
			});
		}

		// Find the cart item
		const cartItem = await Cart.findOne({ where: { cart_id } });

		if (!cartItem) {
			return res.status(404).json({
				success: false,
				message: "Cart item not found.",
			});
		}

		// Find the product to get the updated price
		const product = await Product.findOne({
			where: { product_id: cartItem.product_id },
		});

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found.",
			});
		}

		// Calculate the new price based on the updated quantity
		const updatedPrice = parseFloat(product.price) * quantity;

		// Update the cart item
		cartItem.quantity = quantity;
		cartItem.price = updatedPrice.toFixed(2);
		await cartItem.save();

		return res.status(200).json({
			success: true,
			message: "Cart updated successfully!",
			data: cartItem,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update cart",
			error: error.message,
		});
	}
};

exports.getAllCartItems = async (req, res) => {
	try {
		const { userId } = req;

		// Fetch all cart items for the user, including product details
		const cartItems = await Cart.findAll({
			where: { user_id: userId },
			include: [
				{
					model: Product,
					as: "product_details",
					attributes: [
						"product_name",
						"description",
						"price",
						"product_images",
					],
				},
			],
		});

		if (cartItems.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No items found in the cart.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Cart items fetched successfully!",
			data: cartItems,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch cart items",
			error: error.message,
		});
	}
};

exports.removeItem = async (req, res) => {
	try {
		const { cart_id } = req.query;

		if (!cart_id) {
			return res.status(400).json({
				success: false,
				message: "Cart id is required.",
			});
		}

		const cartItem = await Cart.findOne({ where: { cart_id } });

		if (!cartItem) {
			return res.status(404).json({
				success: false,
				message: "Cart item not found.",
			});
		}

		await cartItem.destroy();

		return res.status(200).json({
			success: true,
			message: "Item removed from cart successfully!",
			data: {},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update cart",
			error: error.message,
		});
	}
};

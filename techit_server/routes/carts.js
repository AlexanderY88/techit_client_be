const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const auth = require("../middlewares/auth");

// get user cart (temporarily without auth for testing)
router.get("/", async (req, res) => {
    try {
        const { userId, isActive } = req.query;
        
        // If userId is provided, get cart by userId
        if (userId) {
            const cart = await Cart.find({ userId, isActive: isActive !== 'false' });
            return res.status(200).json(cart);
        }
        
        // Otherwise use userId from token if available
        const token = req.header("auth-token");
        if (token) {
            try {
                const jwt = require("jsonwebtoken");
                const decoded = jwt.verify(token, process.env.JWTKEY);
                const cart = await Cart.find({ userId: decoded._id, isActive: true });
                return res.status(200).json(cart);
            } catch (err) {
                // Token invalid, continue without auth
            }
        }
        
        res.status(401).send("Authentication required");
    } catch (err) {
        res.status(500).send(err);
    }
});

// create cart
router.post("/", auth, async (req, res) => {
    try {
        const cart = new Cart(req.body);
        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add product to cart or update quantity
router.post("/add-product", async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const token = req.header("auth-token");
        
        if (!token) return res.status(401).send("Authentication required");
        
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWTKEY);
        const userId = decoded._id;
        
        // Find user's active cart
        let cart = await Cart.findOne({ userId, isActive: true });
        
        if (!cart) {
            // Create new cart if doesn't exist
            cart = new Cart({ userId, products: [], isActive: true });
        } else {
            // Clean up any invalid products in existing cart
            cart.products = cart.products.filter(p => p && p.productId && typeof p.productId === 'string');
        }
        
        // Check if product already exists in cart
        const existingProductIndex = cart.products.findIndex(p => p.productId === productId);
        
        if (existingProductIndex > -1) {
            // Update quantity
            cart.products[existingProductIndex].quantity = quantity;
        } else {
            // Add new product with proper structure
            cart.products.push({ 
                productId: productId, 
                quantity: quantity 
            });
        }
        
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Remove product from cart
router.delete("/remove-product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const token = req.header("auth-token");
        
        if (!token) return res.status(401).send("Authentication required");
        
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWTKEY);
        const userId = decoded._id;
        
        // Find user's active cart
        const cart = await Cart.findOne({ userId, isActive: true });
        
        if (!cart) return res.status(404).send("Cart not found");
        
        // Remove product from cart
        cart.products = cart.products.filter(p => p.productId !== productId);
        
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update product quantity in cart - MOVED BEFORE /:id route
router.put("/update-quantity", async (req, res) => {
    console.log("🎯 HIT UPDATE-QUANTITY ROUTE!");
    try {
        const { productId, quantity } = req.body;
        const token = req.header("auth-token");
        
        console.log("Update quantity request:", { productId, quantity });
        console.log("Token present:", !!token);
        
        if (!token) return res.status(401).send("Authentication required");
        if (quantity < 0) return res.status(400).send("Quantity cannot be negative");
        
        const jwt = require("jsonwebtoken");
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWTKEY);
        } catch (jwtError) {
            console.log("JWT verification failed:", jwtError.message);
            return res.status(401).send("Invalid token");
        }
        
        const userId = decoded._id;
        console.log("User ID:", userId);
        
        // Find user's active cart
        let cart = await Cart.findOne({ userId, isActive: true });
        console.log("Cart found:", !!cart);
        
        // Clean up any invalid cart data or create new cart
        if (cart) {
            // Filter out any products that don't have valid productId
            cart.products = cart.products.filter(p => p && p.productId && typeof p.productId === 'string');
        } else {
            // Create new cart if doesn't exist
            cart = new Cart({ userId, products: [], isActive: true });
        }
        
        if (quantity === 0) {
            // Remove product if quantity is 0
            cart.products = cart.products.filter(p => p.productId !== productId);
            console.log("Removed product from cart");
        } else {
            // Update quantity
            const productIndex = cart.products.findIndex(p => p.productId === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity = quantity;
                console.log("Updated existing product quantity");
            } else {
                // Add new product if not exists - ensure proper structure
                cart.products.push({ 
                    productId: productId, 
                    quantity: quantity 
                });
                console.log("Added new product to cart");
            }
        }
        
        // Validate cart before saving
        console.log("Cart products before save:", cart.products);
        await cart.save();
        console.log("Cart saved successfully");
        res.status(200).json(cart);
    } catch (err) {
        console.error("Update quantity error:", err);
        res.status(500).send(err.message || "Internal server error");
    }
});

// update cart - MOVED AFTER specific routes
router.put("/:id", auth, async (req, res) => {
    console.log("🚨 HIT GENERIC /:id ROUTE with ID:", req.params.id);
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cart) return res.status(404).send("Cart not found");
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).send(err);
    }
});

// delete cart
router.delete("/:id", auth, async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        if (!cart) return res.status(404).send("Cart not found");
        res.status(200).send("Cart deleted successfully");
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
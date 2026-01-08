const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middlewares/auth");
const joi = require("joi");

// Test endpoint without auth
router.get("/test", async (req, res) => {
    res.status(200).json({ message: "API is working!", timestamp: new Date() });
});

// get all products (temporarily without auth for testing)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length === 0) return res.status(404).send("No products found");
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

// get product by id (temporarily without auth for testing)
router.get("/:id", async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send(`No product found with id ${req.params.id}`);
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});


// add product  
// joi validation
const checkProductBody = joi.object({
    name: joi.string().required().min(2),
    price: joi.number().required().min(0),
    category: joi.string().required().min(2),
    description: joi.string().min(2),
    image: joi.string(),
    quantity: joi.number().min(0)
}).unknown(true); // Allow unknown fields like _id, id, etc.

router.post("/", auth, async (req,res) => {
    try {
        // check if user is admin
        if (!req.payload.isAdmin) return res.status(400).send("Admins only!");
        // validate body
        const {error} = checkProductBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});


// update product by id (temporarily without auth for testing)
router.put("/:id", async (req,res) => {
    try {
        // validate body
        const {error} = checkProductBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // update product
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!product) return res.status(404).send(`No product found with id ${req.params.id}`);
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

// delete product by id (temporarily without auth for testing)
router.delete("/:id", async (req,res) => {
    try {
        const product = await Product.findOneAndDelete({_id: req.params.id});
        if (!product) return res.status(404).send("product not found");
        res.status(200).send("Product deleted successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});

// add product to the cart 
router.post("/:id", auth, async (req,res) => {
    try {
        // get cart id by user id
        const curt = await Cart.findOne({userId: req.payload._id, isActive: true});
        if (!curt) return res.status(404).send("Active cart not found for user");
        // add product to cart
        curt.products.push({productId: req.params.id, quantity: req.body.quantity || 1});
        if (req.body.quantity === 0) return res.status(400).send("Quantity must be at least 1");
        await curt.save();
        res.status(200).send(curt);
    } catch (error) {
        res.status(500).send(error);
    }
});



module.exports = router;
const express = require("express");
const router = express.Router();
const joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const _ = require("lodash");
const auth = require("../middlewares/auth");

// Test endpoint without auth
router.get("/test", async (req, res) => {
    res.status(200).json({ message: "Users API is working!", timestamp: new Date() });
});

const checkRegisterBody = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required().min(6).max(50),
        password: joi.string().min(6).required().max(50),
        isAdmin: joi.boolean().required()
    });
   
// register route
router.post("/register", async (req, res) => {
    try {
        // 1. joi validation
        const {error} = checkRegisterBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // 2. check if user exist
        let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send("User already registered.");
        // 3. create new user object
        user = new User(req.body);
        // 4. encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        // 5. create token
        const token = jwt.sign({isAdmin: user.isAdmin, _id: user._id}, process.env.JWTKEY);
        // create cart document
        console.log("Creating cart for user:", user._id);
        const cart = new Cart({userId: user._id, products: [], isActive: true});
        await cart.save();
        console.log("Cart created successfully:", cart._id);
        res.status(201).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

const checkLoginBody = joi.object({
    email: joi.string().email().required().min(6).max(50),
    password: joi.string().min(6).required().max(50)
});

// login route
router.post("/login", async (req, res) => {
    try {
        // 1. validate body
        const {error} = checkLoginBody.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        // 2. check if user exist
        let user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send("Wrong email or password.");
        // 3. check password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) return res.status(400).send("Wrong email or password.");
        // 4. create token
        const token = jwt.sign({isAdmin: user.isAdmin, _id: user._id}, process.env.JWTKEY);
        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

// get current user details (requires auth)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.payload._id);
        if (!user) return res.status(404).send("User not found");
        res.status(200).json(_.omit(user.toObject(), ['password', '__v']));
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

// get user details by id 
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("No such user");
        res.status(200).send(_.omit(user, ['password', '__v']));
    } catch (error) {  
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})



module.exports = router;
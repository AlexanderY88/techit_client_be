const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require("mongoose");
// Routes
const users = require("./routes/users");
const carts = require("./routes/carts");
const products = require("./routes/products");
const cors = require("cors");


mongoose 
.connect(process.env.DB)
.then(() => console.log("MongoDB is connected"))
.catch((err) => console.log(err));

// cors middleware
app.use(cors());

// Parse json bodies
app.use(express.json());

// Routes
app.use("/api/users", users);
app.use("/api/carts", carts);
app.use("/api/products", products);

app.listen(port, () => console.log("Server started on port", port));

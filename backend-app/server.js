require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

// imports
const User = require("./model/User.js");
const Product = require("./model/Product.js");
const Cart = require("./model/Cart.js");
const Admin = require("./model/Admin.js");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Cors Error
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// Database Connection
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Database Connected!");
}).catch(err => console.log(err));

// User Auth - Middleware
const userAuth = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await decodedToken;
        req.user = user;
        next();
    } catch(err) {
        return res.status(401).json({
            error: "Login to access"
        })
    }
}

const adminAuth = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await decodedToken;
        req.user = user;
        next();
    } catch(err) {
        return res.status(401).json({
            error: "Login to access"
        })
    }
}

// Admin Role
app.post("/admin/register", (req, res) => {
    Admin.findOne({email: req.body.email}).then(user => {
        bcrypt.compare(req.body.password, user.password).then(passwordCheck => {
            if (!passwordCheck) {
                return res.send({
                    message: "Passwords does not match"
                })
            }
            const token = jwt.sign({userId: user._id, userEmail: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "24h"});
            return res.send({
                message: "Login successfully",
                email: user.email,
                token
            });
        }).catch(err => {
            return res.send({
                message: "Password does not match",
                err
            })
        })
    }).catch(e => {
        return res.send({
            message: "Email not found",
            e,
        })
    })
});


// Account Infos

// Add to cart
app.post("/cart", userAuth, (req, res) => {
    const addToCart = {
        product: req.body.product,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,
        address: req.body.address,
        message: req.body.message,
    }
    return new Cart(addToCart).save().then(data => {
        return res.json({message: "SUCCESS", data});
    }).catch(err => {
        return err;
    })
})

app.get("/cart", (req, res) => {
    return Cart.find().then(data => {
        return res.json(data)
    }).catch(err => {
        return err;
    })
})

// Routes
app.post("/register", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const registerUser = {
            username: username,
            email: email,
            password: hashedPassword
        };
        const newUser = new User(registerUser);
        return newUser.save().then((result) => {
            return res.json({message: "User created successfully", result})
        }).catch((error) => {
            return res.json({message: "Error creating user", error});
        })
    } catch(err) {
        res.status(500).send({
            message: "Password was not hashed successfully",
            err,
        });
    }
});

app.post("/login", (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        bcrypt.compare(req.body.password, user.password).then(passwordCheck => {
            if (!passwordCheck) {
                return res.send({
                    message: "Passwords does not match"
                })
            }
            const token = jwt.sign({userId: user._id, userEmail: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "24h"});
            return res.send({
                message: "Login successfully",
                username: user.username,
                email: user.email,
                token
            });
        }).catch(err => {
            return res.send({
                message: "Password does not match",
                err
            })
        })
    }).catch(e => {
        return res.send({
            message: "Email not found",
            e,
        })
    })
});

app.post("/products", (req, res) => {
    const newProduct = {
        title: req.body.title,
        brand: req.body.brand,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
    }
    return new Product(newProduct).save().then(data => {
        return res.json(data);
    }).catch(err => res.json(err))
})

app.get("/products", (req, res) => {
    return Product.find().then(data => {
        return res.json(data);
    })
})


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})
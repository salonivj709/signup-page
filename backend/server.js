const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import User model
const User = require("./models/User");

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });


// Test API
app.get("/", (req, res) => {
    res.json({
        message: "Signup Backend API is running"
    });
});


// Signup API
app.post("/api/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password
        });

        // Save user
        await user.save();

        res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// LOGIN API
app.post("/api/login", async (req, res) => {

    try {

        // Get email and password from frontend
        const { email, password } = req.body;


        // Check whether fields are provided
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }


        // Find user using email
        const user = await User.findOne({ email });


        // User not found
        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // Compare entered password
        // with hashed password stored in MongoDB
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        // Password is wrong
        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "User not authorized"
            });

        }


        // Login successful
        return res.status(200).json({
            success: true,
            message: "User login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const db = require("./db");

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Test API
app.get("/", (req, res) => {

    res.json({
        message: "Signup and Login API is running"
    });

});


// =========================
// SIGNUP API
// =========================

app.post("/api/signup", async (req, res) => {

    try {

        // Get data from frontend
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


        // Check whether user already exists
        const [existingUser] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        if (existingUser.length > 0) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Insert user into MySQL
        const [result] = await db.execute(
            `INSERT INTO users 
            (name, email, password)
            VALUES (?, ?, ?)`,
            [
                name,
                email,
                hashedPassword
            ]
        );


        // Successful response
        return res.status(201).json({

            success: true,

            message: "Signup successful",

            user: {
                id: result.insertId,
                name: name,
                email: email
            }

        });


    } catch (error) {

        console.log("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// =========================
// LOGIN API
// =========================

app.post("/api/login", async (req, res) => {

    try {

        // Get email and password
        const { email, password } = req.body;


        // Check fields
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }


        // Find user by email
        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        // User doesn't exist
        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // Get first user
        const user = users[0];


        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        // Password incorrect
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
                id: user.id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        console.log("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});
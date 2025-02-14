const express = require('express');
const authController = require('../controllers/authController');
const {swaggerSpec} = require('../swagger')
const {verify} = require("jsonwebtoken");
const User = require("../models/userModel");
const router = express.Router();


router.get("/swagger.json", (req, res) => {
    res.json(swaggerSpec);
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - password
 *               - phoneNumber
 *               - birthDate
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [user, admin, moderator]
 *                 example: "user"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1 555-1234"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-15"
 *               profilePicture:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   state:
 *                     type: string
 *                     example: "NY"
 *                   zipCode:
 *                     type: string
 *                     example: "10001"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully!"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65d7b3f9d3a5cbb45c123456"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     username:
 *                       type: string
 *                       example: "johndoe123"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1 555-1234"
 *                     birthDate:
 *                       type: string
 *                       example: "1995-06-15"
 *                     profilePicture:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: "123 Main St"
 *                         city:
 *                           type: string
 *                           example: "New York"
 *                         state:
 *                           type: string
 *                           example: "NY"
 *                         zipCode:
 *                           type: string
 *                           example: "10001"
 *                         country:
 *                           type: string
 *                           example: "USA"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-02-11T12:34:56.789Z"
 *       400:
 *         description: Invalid input (User already exists or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists!"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error registering user"
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/validate:
 *   get:
 *     summary: Validate user authentication
 *     description: Checks if the provided token is valid and returns user role and username.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # Only for the /auth/validate endpoint
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is valid"
 *                 username:
 *                   type: string
 *                   example: "johndoe123"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Unauthorized or Invalid Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
router.get("/validate", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.setHeader("X-User", user.username);
        res.setHeader("X-Role", user.role);

        return res.status(200).json({ message: "Token is valid", username: user.username, role: user.role });
    } catch (error) {
        console.error("JWT Validation Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
});

module.exports = router;

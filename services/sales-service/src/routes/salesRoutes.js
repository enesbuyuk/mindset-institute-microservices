const express = require('express');
const router = express.Router();
const { createSale, updateSaleStatus, getSales } = require('../controllers/salesController');
const {swaggerSpec} = require("../swagger");

router.get("/swagger.json", (req, res) => {
    res.json(swaggerSpec);
});

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales tracking API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /sales/create:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - amount
 *               - status
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: "64a5f3b2d3e8a4c5f6a7b8c9"
 *               amount:
 *                 type: number
 *                 example: 5000
 *               status:
 *                 type: string
 *                 enum: ["Yeni", "İletişimde", "Anlaşma", "Kapandı"]
 *                 example: "Yeni"
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create', createSale);

/**
 * @swagger
 * /sales/update/{saleId}:
 *   put:
 *     summary: Update sale status
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Yeni", "İletişimde", "Anlaşma", "Kapandı"]
 *                 example: "Kapandı"
 *     responses:
 *       200:
 *         description: Sale status updated successfully
 *       404:
 *         description: Sale not found
 */
router.put('/update/:saleId', updateSaleStatus);

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sales
 *       500:
 *         description: Internal server error
 */
router.get('/', getSales);

module.exports = router;

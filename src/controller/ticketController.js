const express = require('express');
const router = express.Router();
const ticketService = require('../service/ticketService');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: API para venda de ingressos
 */

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Vende um novo ingresso
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - age
 *               - totalValue
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 1
 *               age:
 *                 type: integer
 *                 example: 25
 *               totalValue:
 *                 type: number
 *                 example: 150.00
 *     responses:
 *       201:
 *         description: Venda realizada com sucesso
 *       400:
 *         description: Erro de validação (ex. menor de 18, valor total menor que 100)
 *       401:
 *         description: Unauthorized
 */
router.post('/sales', authMiddleware, (req, res) => {
    try {
        const { quantity, age, totalValue } = req.body;
        const sale = ticketService.sellTicket(quantity, age, totalValue, req.user.id);
        res.status(201).json(sale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Lista todas as vendas de ingressos
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/sales', authMiddleware, (req, res) => {
    const sales = ticketService.getSales();
    res.status(200).json(sales);
});

/**
 * @swagger
 * /sales/{ticket}:
 *   get:
 *     summary: Busca uma venda pelo número do ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticket
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do ticket da venda
 *     responses:
 *       200:
 *         description: Venda encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Unauthorized
 */

router.get('/sales/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;

        const sale = ticketService.getSaleById(id);

        if (!sale) {
            return res.status(404).json({ message: 'Venda não encontrada para este ticket' });
        }

        res.status(200).json(sale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /customer/{cpf}:
 *   get:
 *     summary: Retorna um cliente pelo CPF
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         description: CPF do cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 cpf:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Cliente não encontrado
 */
router.get("/customer/:cpf", async () => {});

module.exports = router;

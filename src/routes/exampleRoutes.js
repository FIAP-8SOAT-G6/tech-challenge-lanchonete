const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /example:
 *   get:
 *     summary: Retorna um exemplo
 *     responses:
 *       200:
 *         description: Exemplo de resposta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exampleField:
 *                   type: string
 *                   example: 'Este é um exemplo'
 */
router.get('/example', (req, res) => {
  res.json({ exampleField: 'Este é um exemplo' });
});

module.exports = router;

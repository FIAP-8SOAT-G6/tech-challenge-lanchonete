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
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with the specified items.
 *     tags:
 *       - Orders
 *     requestBody:
 *       description: Payload to create a new order
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orders:
 *                 type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product_id:
 *                           type: string
 *                           description: ID of the product
 *                         quantity:
 *                           type: integer
 *                           description: Quantity of the product
 *                     example:
 *                       - product_id: "12345"
 *                         quantity: 2
 *             required:
 *               - orders
 *     responses:
 *       '200':
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier for the order
 *                 code:
 *                   type: string
 *                   description: Order code
 *                 status:
 *                   type: string
 *                   description: Current status of the order
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                 customer:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the customer
 *             example:
 *               id: "order123"
 *               code: "ORD456"
 *               status: "confirmed"
 *               items:
 *                 - product_id: "12345"
 *                   quantity: 2
 *               customer:
 *                 name: "John Doe"
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error 
 *   get:
 *     summary: Lista todos os pedidos
 *     description: Foobar
 *     tags:
 *       - Orders
 *     responses:
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 * 
 */

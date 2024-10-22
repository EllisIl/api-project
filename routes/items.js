const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/items');

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve all items
 *     responses:
 *       200:
 *         description: A list of items
 *   post:
 *     summary: Create a new item
 *     responses:
 *       201:
 *         description: The created item
 * /items/{id}:
 *   get:
 *     summary: Get an item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the item to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The item
 *       404:
 *         description: Item not found
 *   put:
 *     summary: Update an item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the item to update
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The updated item
 *       404:
 *         description: Item not found
 *   delete:
 *     summary: Delete an item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the item to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */

router.get('/', itemsController.getAll);
router.get('/:id', itemsController.getSingle);
router.post('/', itemsController.createItem);
router.put('/:id', itemsController.updateItem);
router.delete('/:id', itemsController.deleteItem);

module.exports = router;

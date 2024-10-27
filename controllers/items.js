const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const Joi = require('joi'); // Import Joi for validation

// Define validation schema with Joi
const itemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  available: Joi.boolean().required(),
  createdAt: Joi.date().default(Date.now)
});

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('items').find();
    const items = await result.toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
};

const getSingle = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('items').findOne({ _id: itemId });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item.' });
  }
};

const createItem = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const response = await mongodb.getDb().db().collection('items').insertOne(value);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ error: 'Failed to create item.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the item.' });
  }
};

const updateItem = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);

    // Validate request body
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const response = await mongodb.getDb().db().collection('items').replaceOne({ _id: itemId }, value);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Item not found or no changes made.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the item.' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('items').deleteOne({ _id: itemId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the item.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createItem,
  updateItem,
  deleteItem
};

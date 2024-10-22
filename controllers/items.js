const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('items').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  }).catch(err => {
    res.status(500).json({ error: 'Failed to fetch items.' });
  });
};

const getSingle = async (req, res) => {
  const itemId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('items').find({ _id: itemId });
  result.toArray().then((lists) => {
    if (lists.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  }).catch(err => {
    res.status(500).json({ error: 'Failed to fetch item.' });
  });
};

const createItem = async (req, res) => {
  const item = {
    name: req.body.name, // e.g., "Laptop"
    description: req.body.description, // e.g., "High-performance laptop"
    price: req.body.price, // e.g., 1200
    available: req.body.available, // e.g., true
    createdAt: new Date() // Automatically set the current date
  };
  const response = await mongodb.getDb().db().collection('items').insertOne(item);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the item.');
  }
};

const updateItem = async (req, res) => {
  const itemId = new ObjectId(req.params.id);
  const item = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    available: req.body.available,
    // Optionally update the createdAt timestamp
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('items')
    .replaceOne({ _id: itemId }, item);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Item not found or no changes made.' });
  }
};

const deleteItem = async (req, res) => {
  const itemId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('items').deleteOne({ _id: itemId }, true);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Item not found.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createItem,
  updateItem,
  deleteItem
};

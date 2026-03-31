const express = require('express');
const router = express.Router();
const { createStore, getStores, getStoreProducts } = require('../controllers/storeController');
const { protect, merchant } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, merchant, createStore)
  .get(getStores);

router.route('/:id/products').get(getStoreProducts);

module.exports = router;

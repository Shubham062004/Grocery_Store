const express = require('express');
const router = express.Router();
const { createStore, getStores, getStoreProducts, getMine } = require('../controllers/storeController');
const { protect, merchant } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, merchant, createStore)
  .get(getStores);

router.get('/mine', protect, merchant, getMine);
router.route('/:id/products').get(getStoreProducts);

module.exports = router;

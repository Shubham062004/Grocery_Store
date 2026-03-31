const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct } = require('../controllers/productController');
const { protect, merchant } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, merchant, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, merchant, updateProduct);

module.exports = router;

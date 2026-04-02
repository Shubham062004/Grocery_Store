const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getMyProducts 
} = require('../controllers/productController');
const { protect, merchant } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, merchant, createProduct);

router.route('/myproducts').get(protect, merchant, getMyProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, merchant, updateProduct)
  .delete(protect, merchant, deleteProduct);

module.exports = router;

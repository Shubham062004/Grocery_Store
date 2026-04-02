const Product = require('../models/productModel');
const Store = require('../models/storeModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const storeId = req.query.storeId;

  try {
    const filter = storeId ? { store: storeId } : {};
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Merchant
const updateProduct = async (req, res) => {
  const { name, price, description, image, category, countInStock, unit, brand } = req.body;

  try {
    const product = await Product.findById(req.params.id).populate('store');

    if (product) {
      // Ownership validation
      if (product.store.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this product' });
      }

      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.unit = unit || product.unit;
      product.brand = brand || product.brand;
      product.inStock = product.countInStock > 0;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Merchant
const createProduct = async (req, res) => {
  let { name, price, description, image, category, countInStock, unit, brand } = req.body;

  try {
    const merchantStore = await Store.findOne({ owner: req.user._id });
    if (!merchantStore) {
      return res.status(400).json({ message: 'Merchant must have a store to create products' });
    }

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock,
      unit,
      brand,
      store: merchantStore._id,
      inStock: countInStock > 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Merchant
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('store');

    if (product) {
      // Ownership validation
      if (product.store.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this product' });
      }

      await product.deleteOne(); // Updated from .remove() to .deleteOne() for Mongoose 6+
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get merchant's products
// @route   GET /api/products/myproducts
// @access  Private/Merchant
const getMyProducts = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) {
      return res.status(404).json({ message: 'Store not found for this merchant' });
    }

    const products = await Product.find({ store: store._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct,
  getMyProducts,
};

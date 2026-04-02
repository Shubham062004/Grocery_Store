const Store = require('../models/storeModel');
const Product = require('../models/productModel');

// @desc    Create new store
// @route   POST /api/stores
// @access  Private/Merchant
const createStore = async (req, res, next) => {
  const { name, description, image } = req.body;

  try {
    const store = new Store({
      name,
      description,
      image,
      owner: req.user._id,
    });

    const createdStore = await store.save();
    res.status(201).json(createdStore);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
const getStores = async (req, res, next) => {
  try {
    const stores = await Store.find({}).populate('owner', 'name email');
    res.json(stores);
  } catch (error) {
    next(error);
  }
};

// @desc    Get store products
// @route   GET /api/stores/:id/products
// @access  Public
const getStoreProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ store: req.params.id });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's store
// @route   GET /api/stores/mine
// @access  Private/Merchant
const getMine = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    
    if (store) {
      res.json(store);
    } else {
      res.status(404);
      const error = new Error('Store not found');
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStore,
  getStores,
  getStoreProducts,
  getMine,
};

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Dairy', 'Bakery', 'Beverages', 'Snacks', 'Fruits', 'Vegetables', 'Staples', 'Oil', 'Grains'],
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit of measurement (e.g., 1L, 500g)'],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Please link this product to a store'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);

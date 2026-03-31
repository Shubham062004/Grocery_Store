const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a store name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a store description'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Store', storeSchema);

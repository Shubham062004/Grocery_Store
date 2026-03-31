const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Store = require('./models/storeModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

const testSeeder = async () => {
  try {
    const connectDB = require('./config/db');
    await connectDB();
    
    const merchantEmail = `test-${Date.now()}@example.com`;
    console.log('Creating merchant...');
    const merchant = await User.create({
      name: 'Test Merchant',
      email: merchantEmail,
      password: 'password123',
      role: 'merchant'
    });

    console.log('Creating store...');
    const store = await Store.create({
      name: 'Test Store',
      description: 'Test Description',
      owner: merchant._id
    });

    console.log('Created Store ID:', store._id);

    const productData = {
      name: 'Test Product',
      image: 'https://example.com/image.jpg',
      category: 'Dairy',
      brand: 'Test Brand',
      description: 'Test Description',
      price: 10,
      countInStock: 10,
      unit: '1L',
      store: store._id
    };

    console.log('Attempting to create product:', JSON.stringify(productData, null, 2));

    const createdProduct = await Product.create(productData);
    console.log('Product Success!', createdProduct._id);
    
    // Cleanup
    await Product.deleteOne({ _id: createdProduct._id });
    await Store.deleteOne({ _id: store._id });
    await User.deleteOne({ _id: merchant._id });
    
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err.message);
    if (err.errors) console.error('Validation Errors:', Object.keys(err.errors));
    process.exit(1);
  }
};

testSeeder();

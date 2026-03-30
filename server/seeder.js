const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const products = [
  {
    name: 'Basmati Rice (5kg)',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=500',
    category: 'Grains',
    brand: 'India Gate',
    description: 'Long grain aromatic rice, perfect for biryani and daily meals.',
    price: 450,
    countInStock: 50,
    unit: '5kg'
  },
  {
    name: 'Fresh Milk (1L)',
    image: 'https://images.unsplash.com/photo-1563636619-e9107da5a163?q=80&w=500',
    category: 'Dairy',
    brand: 'Amul',
    description: 'Fresh toned milk, rich in nutrients and vitamins.',
    price: 60,
    countInStock: 100,
    unit: '1L'
  },
  {
    name: 'Sunflower Oil (1L)',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=500',
    category: 'Oil',
    brand: 'Fortune',
    description: 'Healthy and light sunflower oil for all your cooking needs.',
    price: 180,
    countInStock: 40,
    unit: '1L'
  },
  {
    name: 'Whole Wheat Bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500',
    category: 'Bakery',
    brand: 'Harvest Gold',
    description: 'Freshly baked 100% whole wheat bread, high in fiber.',
    price: 45,
    countInStock: 30,
    unit: '400g'
  },
  {
    name: 'Farm Fresh Eggs (12 pcs)',
    image: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?q=80&w=500',
    category: 'Dairy',
    brand: 'Local Farm',
    description: 'Farm fresh white eggs, high in protein.',
    price: 90,
    countInStock: 60,
    unit: '12 pcs'
  },
];

const importData = async () => {
  try {
    await Product.deleteMany();
    console.log('Old Data Destroyed!');

    await Product.insertMany(products);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

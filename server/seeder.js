const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Store = require('./models/storeModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const storesData = [
  { name: 'Balaji Grocery Hub', description: 'Your one-stop shop for fresh groceries.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500' },
  { name: 'FreshMart Express', description: 'Quick and fresh grocery staples for daily needs.', image: 'https://images.unsplash.com/photo-1604719312563-8912e9223c6a?q=80&w=500' },
  { name: 'Green Valley Organics', description: 'Certified organic vegetables and healthy staples.', image: 'https://images.unsplash.com/photo-1543083477-4f7f44aad226?q=80&w=500' },
  { name: 'Daily Needs Store', description: 'Best deals on everyday household products.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=500' },
  { name: 'Budget Basket', description: 'Wholesale prices for premium quality products.', image: 'https://images.unsplash.com/photo-1534723452862-4c874e70d98a?q=80&w=500' },
];

const productsData = [
  // Staples
  { name: 'Basmati Rice (5kg)', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=500', category: 'Grains', brand: 'India Gate', description: 'Long grain aromatic rice.', price: 450, countInStock: 50, unit: '5kg' },
  { name: 'Whole Wheat Atta (10kg)', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500', category: 'Staples', brand: 'Aashirvaad', description: '100% whole wheat flour.', price: 420, countInStock: 30, unit: '10kg' },
  // Dairy
  { name: 'Fresh Milk (1L)', image: 'https://images.unsplash.com/photo-1563636619-e9107da5a163?q=80&w=500', category: 'Dairy', brand: 'Amul', description: 'Fresh toned milk.', price: 60, countInStock: 100, unit: '1L' },
  { name: 'Butter (500g)', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=500', category: 'Dairy', brand: 'Amul', description: 'Pure milk butter.', price: 250, countInStock: 40, unit: '500g' },
  // Bakery
  { name: 'Whole Wheat Bread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500', category: 'Bakery', brand: 'Harvest Gold', description: 'High fiber bread.', price: 45, countInStock: 30, unit: '400g' },
  { name: 'Chocolate Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=500', category: 'Bakery', brand: 'Britannia', description: 'Assorted chocolate cookies.', price: 80, countInStock: 50, unit: '200g' },
  // Beverages
  { name: 'Green Tea (25 bags)', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=500', category: 'Beverages', brand: 'Tetley', description: 'Pure green tea.', price: 150, countInStock: 25, unit: '25 bags' },
  { name: 'Black Coffee (100g)', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=500', category: 'Beverages', brand: 'Nescafe', description: 'Arabbica roast coffee.', price: 320, countInStock: 15, unit: '100g' },
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Store.deleteMany();
    await User.deleteMany();
    console.log('Old Data Destroyed!');

    const createdStores = [];

    // Create 5 merchants and their stores
    for (let i = 0; i < storesData.length; i++) {
        const merchant = await User.create({
            name: `Merchant ${i + 1}`,
            email: `merchant${i + 1}@example.com`,
            password: 'password123',
            role: 'merchant'
        });

        const store = await Store.create({
            ...storesData[i],
            owner: merchant._id
        });
        createdStores.push(store);
    }

    console.log('Stores Created Successfully!');

    // Distribute products across stores
    for (let i = 0; i < productsData.length; i++) {
        // Each store gets at least 2 categories of products
        const storeIndex = i % createdStores.length;
        await Product.create({
            ...productsData[i],
            store: createdStores[storeIndex]._id
        });
    }
    
    // Add some duplicate product types to other stores to ensure every store has products
    for (let i = 0; i < createdStores.length; i++) {
        const store = createdStores[i];
        // Add a few more random products to each store
        await Product.create({
            ...productsData[i % productsData.length],
            name: `${productsData[i % productsData.length].name} (S${i+1})`,
            store: store._id
        });
    }

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
    await Store.deleteMany();
    await User.deleteMany();
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

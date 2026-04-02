const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// @desc    Create new order with inventory validation and atomic stock update
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    return next(new Error('No order items'));
  }

  // Start Session for Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalPrice = 0;
    const validatedOrderItems = [];

    // 1. Validate Items, Get DB Prices, and Deduct Stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.name}`);
      }

      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${item.name}. Available: ${product.countInStock}`);
      }

      // Calculate total using DB price
      const itemTotal = product.price * item.qty;
      totalPrice += itemTotal;

      // Deduct stock atomically
      product.countInStock -= item.qty;
      product.inStock = product.countInStock > 0;
      await product.save({ session });

      // Add to validated items (use DB price)
      validatedOrderItems.push({
        name: product.name,
        qty: item.qty,
        image: product.image,
        price: product.price,
        product: product._id,
      });
    }

    // 2. Create Order with backend-calculated totalPrice
    const order = new Order({
      orderItems: validatedOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save({ session });

    // 3. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error) {
    // 4. Abort Transaction on Error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
};

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { getUseJsonDb } from '../config/db.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { products, shippingAddress } = req.body;

  try {
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Please provide full shipping address' });
    }

    const orderItems = [];
    let totalAmount = 0;

    // Check stock, snapshot details, and compute total
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Only ${product.stock} units available.`
        });
      }

      // Snapshot values
      orderItems.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });

      totalAmount += product.price * item.quantity;

      // Update product stock
      const updatedStock = product.stock - item.quantity;
      await Product.findByIdAndUpdate(product._id.toString(), { stock: updatedStock });
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id.toString(),
      products: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: 'Completed', // Simulating successful credit card charge
      orderStatus: 'Pending',
      trackingNumber: ''
    });

    // Clear user's cart
    if (getUseJsonDb()) {
      const cart = await Cart.findOne({ userId: req.user._id.toString() });
      if (cart) {
        cart.products = [];
        const cartInstance = Cart.createInstance(cart);
        await cartInstance.save();
      }
    } else {
      await Cart.findOneAndUpdate({ userId: req.user._id }, { products: [] });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id.toString() });
    
    // Sort orders by newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID (Tracking)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Allow the user who placed the order OR an admin to view it
      if (order.userId.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Access denied to this order details' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

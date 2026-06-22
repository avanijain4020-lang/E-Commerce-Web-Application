import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { getUseJsonDb } from '../config/db.js';

// Helper to populate cart items in JSON DB mode
const populateCart = async (cart) => {
  if (!cart) return null;
  
  const populatedProducts = [];
  for (const item of cart.products) {
    const product = await Product.findById(item.productId);
    if (product) {
      populatedProducts.push({
        productId: product,
        quantity: item.quantity,
        _id: item._id
      });
    }
  }
  
  return {
    ...cart,
    products: populatedProducts
  };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getUserCart = async (req, res) => {
  try {
    let cart;
    if (getUseJsonDb()) {
      cart = await Cart.findOne({ userId: req.user._id.toString() });
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id.toString(), products: [] });
      }
      cart = await populateCart(cart);
    } else {
      cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id, products: [] });
      }
      // Populate product details
      cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart;
    if (getUseJsonDb()) {
      cart = await Cart.findOne({ userId: req.user._id.toString() });
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id.toString(), products: [] });
      }

      const existingIndex = cart.products.findIndex(p => p.productId === productId);
      if (existingIndex > -1) {
        cart.products[existingIndex].quantity += qty;
      } else {
        cart.products.push({ productId, quantity: qty });
      }

      // Save using JSON DB instance save method
      const cartInstance = Cart.createInstance(cart);
      await cartInstance.save();
      
      const populated = await populateCart(cart);
      res.json(populated);
    } else {
      cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id, products: [] });
      }

      const existingIndex = cart.products.findIndex(
        p => p.productId.toString() === productId
      );

      if (existingIndex > -1) {
        cart.products[existingIndex].quantity += qty;
      } else {
        cart.products.push({ productId, quantity: qty });
      }

      await cart.save();
      const populated = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
      res.json(populated);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity);

  if (qty <= 0) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    let cart;
    if (getUseJsonDb()) {
      cart = await Cart.findOne({ userId: req.user._id.toString() });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const idx = cart.products.findIndex(p => p.productId === productId);
      if (idx > -1) {
        cart.products[idx].quantity = qty;
        const cartInstance = Cart.createInstance(cart);
        await cartInstance.save();
        
        const populated = await populateCart(cart);
        return res.json(populated);
      } else {
        return res.status(404).json({ message: 'Product not in cart' });
      }
    } else {
      cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const idx = cart.products.findIndex(p => p.productId.toString() === productId);
      if (idx > -1) {
        cart.products[idx].quantity = qty;
        await cart.save();
        const populated = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
        return res.json(populated);
      } else {
        return res.status(404).json({ message: 'Product not in cart' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    let cart;
    if (getUseJsonDb()) {
      cart = await Cart.findOne({ userId: req.user._id.toString() });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      cart.products = cart.products.filter(p => p.productId !== productId);
      const cartInstance = Cart.createInstance(cart);
      await cartInstance.save();
      
      const populated = await populateCart(cart);
      res.json(populated);
    } else {
      cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      cart.products = cart.products.filter(p => p.productId.toString() !== productId);
      await cart.save();
      
      const populated = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
      res.json(populated);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

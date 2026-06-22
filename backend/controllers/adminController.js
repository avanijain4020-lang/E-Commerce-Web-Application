import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    const allOrders = await Order.find({});
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Sales over time (group by day for the last 7 days)
    const salesOverTime = [];
    const dateMap = {};

    // Initialize past 7 days with 0 sales
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
    }

    // Accumulate order amounts
    allOrders.forEach(order => {
      const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr] += order.totalAmount;
      }
    });

    Object.keys(dateMap).sort().forEach(date => {
      salesOverTime.push({
        date,
        sales: Math.round(dateMap[date] * 100) / 100
      });
    });

    // Recent 5 Orders with customer details
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentOrdersRaw = allOrders.slice(0, 5);
    const recentOrders = [];

    for (const order of recentOrdersRaw) {
      const customer = await User.findById(order.userId);
      // Determine if object is Mongoose document or plain JSON object
      const plainOrder = order.toObject ? order.toObject() : { ...order };
      recentOrders.push({
        ...plainOrder,
        customerName: customer ? customer.name : 'Guest User',
        customerEmail: customer ? customer.email : 'guest@example.com'
      });
    }

    res.json({
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers
      },
      salesOverTime,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getManageOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const enrichedOrders = [];
    for (const order of orders) {
      const customer = await User.findById(order.userId);
      const plainOrder = order.toObject ? order.toObject() : { ...order };
      enrichedOrders.push({
        ...plainOrder,
        customerName: customer ? customer.name : 'Guest User',
        customerEmail: customer ? customer.email : 'guest@example.com'
      });
    }

    res.json(enrichedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status / tracking
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { orderStatus, trackingNumber } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          orderStatus: orderStatus || order.orderStatus,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber
        },
        { new: true }
      );

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getManageUsers = async (req, res) => {
  try {
    const users = await User.find({});
    
    // Remove passwords from results
    const sanitizedUsers = users.map(user => {
      const plainUser = user.toObject ? user.toObject() : { ...user };
      delete plainUser.password;
      return plainUser;
    });

    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Please provide a valid role (user or admin)' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent self de-privileging for safety
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot change your own admin role' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      );
      
      const plainUser = updatedUser.toObject ? updatedUser.toObject() : { ...updatedUser };
      delete plainUser.password;

      res.json(plainUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot delete yourself' });
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

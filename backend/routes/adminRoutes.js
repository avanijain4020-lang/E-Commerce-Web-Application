import express from 'express';
import {
  getDashboardAnalytics,
  getManageOrders,
  updateOrderStatus,
  getManageUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/analytics', getDashboardAnalytics);
router.get('/orders', getManageOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getManageUsers);
router.put('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;

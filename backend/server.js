import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Model imports (for auto-seeding)
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows loading images from external URLs
}));
app.use(cors({
  origin: '*', // Allows all origins for local dev/testing
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to general API calls
app.use('/api', apiLimiter);

// Bind routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ApexCart Premium E-Commerce API is running' });
});

// Seed data function
const seedData = async () => {
  try {
    const userCount = await User.countDocuments({});
    if (userCount === 0) {
      console.log('🌱 No users found, seeding default user and admin...');
      
      const salt = await bcrypt.genSalt(10);
      const userPassword = await bcrypt.hash('password123', salt);
      const adminPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        name: 'John Buyer',
        email: 'user@example.com',
        password: userPassword,
        role: 'user'
      });

      await User.create({
        name: 'Sarah Manager',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin'
      });
      
      console.log('✅ Default users seeded successfully:');
      console.log('   👤 Customer: user@example.com / password123');
      console.log('   🛡️ Admin: admin@example.com / admin123');
    }

    const productCount = await Product.countDocuments({});
    if (productCount === 0) {
      console.log('🌱 No products found, seeding catalog...');
      const mockProducts = [
        {
          name: 'Minimalist Mechanical Keyboard',
          description: 'Anodized aluminum frame, hot-swappable tactile switches, and premium dual-shot PBT keycaps. Ideal for developers and writers.',
          price: 189.99,
          category: 'Electronics',
          stock: 25,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
        },
        {
          name: 'Studio Wireless Headphones',
          description: 'Active noise-canceling high-fidelity headphones with spatial audio tracking, custom EQ, and a premium steel head-arch.',
          price: 299.99,
          category: 'Audio',
          stock: 12,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
        },
        {
          name: 'Desk Mat (Slate Gray)',
          description: 'Water-resistant, anti-fray felt desk pad with a non-slip natural cork base layer. Protects desk and enhances optical mouse tracking.',
          price: 39.99,
          category: 'Accessories',
          stock: 45,
          image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80'
        },
        {
          name: '4K Curved Wide Monitor',
          description: '34-inch curved display featuring a DCI-P3 98% IPS panel, HDR600 lighting, 144Hz response speed, and clean single-cable USB-C connection.',
          price: 699.99,
          category: 'Electronics',
          stock: 6,
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
        },
        {
          name: 'MagSafe Dock Stand',
          description: 'Precision-machined matte aluminum charging stand for smartphones. Weighted base with silicon pads prevents slipping.',
          price: 49.99,
          category: 'Accessories',
          stock: 50,
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80'
        },
        {
          name: 'Leather Travel Wallet',
          description: 'Full-grain vegetable-tanned leather passport wallet with integrated RFID protection and designated slots for cards and cash.',
          price: 79.99,
          category: 'Lifestyle',
          stock: 30,
          image: 'https://images.unsplash.com/photo-1627124765135-565518344558?w=600&auto=format&fit=crop&q=80'
        },
        {
          name: 'Smart Ambient Lightbar',
          description: 'RGB desktop ambient light tubes with music synchronization, desktop app control, custom routines, and voice assistant integration.',
          price: 89.99,
          category: 'Electronics',
          stock: 20,
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
        },
        {
          name: 'Ergonomic Office Chair',
          description: 'Highly breathable mesh body with adjustable 3D armrests, responsive lumbar cushion, and robust tilt-lock system.',
          price: 449.99,
          category: 'Furniture',
          stock: 10,
          image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80'
        }
      ];

      for (const prod of mockProducts) {
        await Product.create(prod);
      }
      console.log('✅ 8 Premium mock products seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding data:', error.message);
  }
};

// Catch-all 404 & Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedData().then(() => {
    app.listen(PORT, () => {
      console.log(`\x1b[36m%s\x1b[0m`, `⚡ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  });
});

<div align="center">

# 🛒 ApexCart — Premium Full-Stack E-Commerce Platform

> A production-ready, full-stack e-commerce web application inspired by the clean aesthetics of Apple, the scale of Amazon, and modern SaaS design principles.

### 🔗 *(Live Demo coming soon! See deployment instructions below)*

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind%20CSS-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-MongoDB%20%2F%20JSON%20Fallback-orange?style=for-the-badge)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-red?style=for-the-badge)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** with bcrypt password hashing
- 👤 **Role-Based Access Control** — Admin & Customer roles
- 🛍️ **Product Catalog** with search, category filters, price range & sorting
- 🛒 **Shopping Cart** — Guest + logged-in user sync
- 💳 **Secure Checkout** with address validation & mock payment gateway
- 📦 **Order Tracking** — Visual stepper (Pending → Processing → Shipped → Delivered)
- 📊 **Admin Dashboard** — Revenue analytics, product CRUD, order management, user controls
- 🌓 **Dark / Light Mode** toggle with system preference detection
- 🔋 **Zero-Config DB Fallback** — Runs with local JSON files if MongoDB is unavailable
- 📱 **Fully Responsive** — Mobile-first design with glassmorphism UI

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js, MVC Architecture |
| **Database** | MongoDB (Mongoose) with JSON file fallback |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **Security** | Helmet, CORS, express-rate-limit |
| **Dev Tools** | Vite, Nodemon, ESLint |

---

## 📁 Project Structure

```
premium-ecommerce/
├── backend/                  # Node.js + Express.js Backend API
│   ├── config/               # Database connection managers
│   ├── controllers/          # API Route Logic (MVC Pattern)
│   ├── middleware/           # Auth guards, security, rate limiters
│   ├── models/               # Database Schema wrappers
│   ├── routes/               # API route maps
│   └── utils/                # JWT and JSON database fallback helper
├── frontend/                 # Vite + React.js Frontend
│   ├── src/
│   │   ├── components/       # Common UI: Navbar, Footer, GlassCard, etc.
│   │   ├── context/          # State providers: Auth, Cart, Theme
│   │   ├── pages/            # View pages: Home, Catalog, Details, Dashboards
│   │   └── utils/            # API network request wrappers
│   └── tailwind.config.js    # Curated SaaS colors and theme options
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** (Optional — backend falls back to local JSON files automatically)

### 1. Clone the Repository
```bash
git clone https://github.com/avanijain4020-lang/E-Commerce-Web-Application.git
cd E-Commerce-Web-Application
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
The API will run at **http://localhost:5000**

### 3. Start Frontend Client
Open a **new terminal**:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
The React app will run at **http://localhost:5173**

---

## 🔑 Test Accounts (Pre-seeded)

| Role | Email | Password |
|------|-------|----------|
| 👤 Customer | `user@example.com` | `password123` |
| 🛡️ Admin | `admin@example.com` | `admin123` |

> **Tip:** The Login page has **Quick Auth** buttons to instantly sign in — no typing required!

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/auth/profile` | Get current user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (search, filter, sort, paginate) |
| GET | `/api/products/:id` | Get single product by ID |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add product to cart |
| PUT | `/api/cart` | Update item quantity |
| DELETE | `/api/cart/:productId` | Remove item from cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/myorders` | Get user's order history |
| GET | `/api/orders/:id` | Get order by ID |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics` | Dashboard analytics data |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id` | Update order status |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user |

---

## 🌐 Deployment

### Frontend — Vercel
1. Import the GitHub repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Framework: **Vite** • Build: `npm run build` • Output: `dist`

### Backend — Render
1. Create a Web Service on [Render](https://render.com)
2. Set **Root Directory** to `backend`
3. Build: `npm install` • Start: `node server.js`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ by [Avani Jain](https://github.com/avanijain4020-lang)**

⭐ Star this repo if you found it helpful!

</div>

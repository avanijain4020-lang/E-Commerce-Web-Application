import React, { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Core layout components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';

// Pages
import Home from './pages/Home.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function MainApp() {
  const [page, setPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const navigate = useCallback((targetPage, params = {}) => {
    setPage(targetPage);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home onNavigate={navigate} showToast={showToast} />;
      case 'products':
        return <ProductList onNavigate={navigate} initialFilters={pageParams} />;
      case 'product-details':
        return <ProductDetails onNavigate={navigate} params={pageParams} showToast={showToast} />;
      case 'cart':
        return <Cart onNavigate={navigate} showToast={showToast} />;
      case 'checkout':
        return <Checkout onNavigate={navigate} showToast={showToast} />;
      case 'dashboard':
        return <UserDashboard onNavigate={navigate} showToast={showToast} />;
      case 'admin':
        return <AdminDashboard showToast={showToast} />;
      case 'login':
        return <Login onNavigate={navigate} params={pageParams} showToast={showToast} />;
      case 'register':
        return <Register onNavigate={navigate} params={pageParams} showToast={showToast} />;
      default:
        return <Home onNavigate={navigate} showToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark transition-colors duration-300">
      <Navbar onNavigate={navigate} currentPage={page} />
      
      <main className="flex-1 w-full">
        {renderPage()}
      </main>
      
      <Footer onNavigate={navigate} />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

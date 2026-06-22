import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Search,
  ShoppingCart
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate('products', { search: searchVal });
    setSearchVal('');
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav w-full py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-300">
      {/* Logo */}
      <div 
        onClick={() => onNavigate('home')} 
        className="flex items-center gap-2 cursor-pointer font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        <ShoppingBag className="text-primary h-7 w-7 stroke-[2.5]" />
        <span>ApexCart</span>
      </div>

      {/* Desktop Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-1/3">
        <input
          type="text"
          placeholder="Search premium products..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-200"
        />
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
      </form>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <button 
          onClick={() => onNavigate('products')} 
          className={`text-sm font-medium hover:text-primary transition-colors ${currentPage === 'products' ? 'text-primary' : 'text-text-light/80 dark:text-text-dark/80'}`}
        >
          Catalog
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light/80 dark:text-text-dark/80 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Cart */}
        <button 
          onClick={() => onNavigate('cart')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light/80 dark:text-text-dark/80 transition-colors relative"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Account / Login */}
        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'admin' ? (
              <button 
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary-light transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Panel</span>
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            )}
            <button 
              onClick={() => { logout(); onNavigate('home'); }}
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onNavigate('login')}
            className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-semibold glow-btn shadow-premium transition-all duration-200"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Actions (Menu & Cart) */}
      <div className="flex items-center gap-3 md:hidden">
        {/* Theme Toggle Mobile */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light/80 dark:text-text-dark/80"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Cart Mobile */}
        <button 
          onClick={() => onNavigate('cart')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light/80 dark:text-text-dark/80 relative"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {cartCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light/80 dark:text-text-dark/80"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[73px] left-0 w-full glass shadow-premium p-6 flex flex-col gap-4 md:hidden border-b border-slate-200 dark:border-slate-850 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          </form>

          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigate('products'); }}
            className="text-left font-medium py-2 hover:text-primary transition-colors text-text-light dark:text-text-dark"
          >
            All Products
          </button>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onNavigate('admin'); }}
                  className="text-left font-semibold py-2 text-secondary hover:text-secondary-light flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin Panel</span>
                </button>
              ) : (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard'); }}
                  className="text-left font-semibold py-2 text-primary hover:text-primary-light flex items-center gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>User Dashboard</span>
                </button>
              )}

              <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">Signed in as</span>
                  <span className="text-sm font-semibold truncate max-w-[200px]">{user.name}</span>
                </div>
                <button 
                  onClick={() => { setMobileMenuOpen(false); logout(); onNavigate('home'); }}
                  className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 py-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('login'); }}
              className="w-full text-center py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-premium"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

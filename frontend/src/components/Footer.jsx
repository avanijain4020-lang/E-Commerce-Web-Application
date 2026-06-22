import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Heart, Mail } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-16 px-6 md:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-max"
          >
            <ShoppingBag className="text-primary h-6 w-6" />
            <span>ApexCart</span>
          </div>
          <p className="text-sm text-text-mutedLight dark:text-text-mutedDark leading-relaxed">
            Crafting premium workspace electronics and lifestyle accessories designed for modern digital creators.
          </p>
          <div className="flex gap-4 mt-2">
            {['Twitter', 'Instagram', 'GitHub', 'LinkedIn'].map((platform, idx) => (
              <a 
                key={idx} 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="text-xs text-text-mutedLight dark:text-text-mutedDark hover:text-primary dark:hover:text-primary transition-colors"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        {/* Shop Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-text-light dark:text-text-dark">Shop Catalog</h4>
          <ul className="flex flex-col gap-2">
            {['Electronics', 'Audio', 'Accessories', 'Lifestyle', 'Furniture'].map((category) => (
              <li key={category}>
                <button 
                  onClick={() => onNavigate('products', { category })}
                  className="text-sm text-text-mutedLight dark:text-text-mutedDark hover:text-primary transition-colors text-left"
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources / Help */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-text-light dark:text-text-dark">Customer Support</h4>
          <ul className="flex flex-col gap-2 text-sm text-text-mutedLight dark:text-text-mutedDark">
            <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-primary transition-colors">Shipping & Returns</a></li>
            <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-primary transition-colors">FAQ Support</a></li>
            <li><a href="#" onClick={e => e.preventDefault()} className="hover:text-primary transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-text-light dark:text-text-dark">Stay Updated</h4>
          <p className="text-sm text-text-mutedLight dark:text-text-mutedDark leading-relaxed">
            Subscribe to receive exclusive launches, early access pricing, and editorial content.
          </p>
          <form onSubmit={handleSubscribe} className="flex relative items-center mt-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-4 pr-12 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-250"
            />
            <button 
              type="submit"
              className="absolute right-1.5 p-2 rounded-full bg-primary hover:bg-primary-dark text-white shadow transition-all duration-200"
              aria-label="Submit subscribe"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {subscribed && (
            <span className="text-xs text-green-500 font-semibold animate-fade-in">
              🎉 Thanks for subscribing to our updates!
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-text-mutedLight dark:text-text-mutedDark gap-4">
        <span>© {new Date().getFullYear()} ApexCart Inc. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Designed with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for digital professionals.
        </span>
      </div>
    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { ArrowLeft, Star, ShoppingCart, CreditCard, ShieldCheck, Heart } from 'lucide-react';

export default function ProductDetails({ onNavigate, params = {}, showToast }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.products.getById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product details:', err.message);
        showToast('Product not found', 'error');
        onNavigate('products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, onNavigate, showToast]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product, quantity);
      showToast(`Added ${quantity} x "${product.name}" to cart`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product, quantity);
      onNavigate('cart');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-20 flex justify-center items-center">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('products')}
        className="flex items-center gap-2 text-sm font-semibold text-text-mutedLight dark:text-text-mutedDark hover:text-primary transition-colors w-max"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
        <span>Back to catalog</span>
      </button>

      {/* Main Product Info Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mt-4">
        {/* Left Side: Product Image Display */}
        <GlassCard hoverLift={false} className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
          <div className="w-full aspect-square rounded-premium overflow-hidden relative group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-zoom-in"
            />
          </div>
        </GlassCard>

        {/* Right Side: Specifications and Purchases */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary dark:text-primary-light">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-light dark:text-text-dark leading-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="text-xs text-text-mutedLight dark:text-text-mutedDark font-semibold">5.0 Star Rating</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-xs text-green-500 font-semibold">In Stock ({product.stock} units)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-slate-100 dark:border-slate-850 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-text-light dark:text-text-dark">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-text-mutedLight dark:text-text-mutedDark line-through">
              ${(product.price * 1.15).toFixed(2)}
            </span>
            <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded">
              Save 15%
            </span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-sm text-text-light dark:text-text-dark uppercase tracking-wider">
              Overview
            </h3>
            <p className="text-sm text-text-mutedLight dark:text-text-mutedDark leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity selector and Cart adding buttons */}
          {product.stock > 0 ? (
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">Quantity:</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-full overflow-hidden bg-white dark:bg-slate-900">
                  <button 
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold">{quantity}</span>
                  <button 
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))}
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-semibold hover:bg-slate-900 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 border border-slate-900 dark:border-white shadow-premium"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold glow-btn transition-colors flex items-center justify-center gap-2 shadow-premium"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-premium bg-red-500/10 text-red-500 text-sm font-semibold border border-red-500/20 text-center mt-4">
              🚫 Out of Stock. This product is currently unavailable.
            </div>
          )}

          {/* Secure purchase certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-850 mt-2 text-xs text-text-mutedLight dark:text-text-mutedDark">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-primary stroke-[2]" />
              <span>Secure Checkout & Card Encryption</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Heart className="h-5 w-5 text-secondary stroke-[2]" />
              <span>Eco-friendly materials and packaging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

export default function Cart({ onNavigate, showToast }) {
  const { user } = useAuth();
  const { cart, updateCartQuantity, removeFromCart, cartCount, cartTotal } = useCart();

  const shippingCost = cartTotal >= 150 || cartTotal === 0 ? 0 : 15;
  const taxCost = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingCost + taxCost;

  const handleCheckoutClick = () => {
    if (user) {
      onNavigate('checkout');
    } else {
      showToast('Please sign in to complete your checkout', 'info');
      onNavigate('login', { redirect: 'checkout' });
    }
  };

  const handleQuantityChange = async (productId, currentQty, amount) => {
    const nextQty = currentQty + amount;
    if (nextQty <= 0) return;
    try {
      await updateCartQuantity(productId, nextQty);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      showToast('Product removed from cart', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Your Shopping Cart</h1>

      {cart.products.length === 0 ? (
        <div className="w-full py-20 glass rounded-premium flex flex-col items-center justify-center text-center gap-5 border border-slate-100 dark:border-slate-800/50">
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900">
            <ShoppingCart className="h-10 w-10 text-slate-400" />
          </div>
          <div className="flex flex-col gap-1.5 max-w-sm">
            <h3 className="text-lg font-bold">Your cart is empty</h3>
            <p className="text-sm text-text-mutedLight dark:text-text-mutedDark">
              Add premium workspace electronics and lifestyle accessories to get started.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('products')}
            className="px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-sm"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.products.map((item) => {
              const product = item.productId;
              // Safety fallback in case details failed to load
              if (!product) return null;

              return (
                <GlassCard key={product._id} hoverLift={false} className="flex flex-col sm:flex-row gap-6 p-4 items-center">
                  {/* Thumbnail Image */}
                  <div className="h-20 w-20 rounded-lg bg-slate-150 dark:bg-slate-850 overflow-hidden relative shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info Details */}
                  <div className="flex-1 flex flex-col gap-1 text-center sm:text-left min-w-0">
                    <h3 
                      onClick={() => onNavigate('product-details', { id: product._id })}
                      className="font-bold text-base hover:text-primary transition-colors cursor-pointer truncate"
                    >
                      {product.name}
                    </h3>
                    <span className="text-xs text-text-mutedLight dark:text-text-mutedDark uppercase tracking-wider font-semibold">
                      {product.category}
                    </span>
                    <span className="text-sm font-semibold text-text-light/95 dark:text-text-dark/95 mt-1 sm:hidden">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={item.quantity <= 1}
                      onClick={() => handleQuantityChange(product._id, item.quantity, -1)}
                      className="p-1.5 px-3 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 font-bold transition-all text-xs"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button 
                      disabled={item.quantity >= product.stock}
                      onClick={() => handleQuantityChange(product._id, item.quantity, 1)}
                      className="p-1.5 px-3 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 font-bold transition-all text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Pricing and Delete */}
                  <div className="hidden sm:flex flex-col items-end gap-1 min-w-[80px]">
                    <span className="text-base font-extrabold">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">
                      (${product.price.toFixed(2)} each)
                    </span>
                  </div>

                  <button 
                    onClick={() => handleRemove(product._id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </GlassCard>
              );
            })}
          </div>

          {/* Cart Pricing summary panel */}
          <div className="lg:col-span-1">
            <div className="glass rounded-premium p-6 border border-slate-100 dark:border-slate-800/50 flex flex-col gap-6">
              <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
                Order Summary
              </h3>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-text-mutedLight dark:text-text-mutedDark">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-text-light dark:text-text-dark">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-text-mutedLight dark:text-text-mutedDark">
                  <span>Shipping</span>
                  <span className="font-semibold text-text-light dark:text-text-dark">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-text-mutedLight dark:text-text-mutedDark">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-text-light dark:text-text-dark">
                    ${taxCost.toFixed(2)}
                  </span>
                </div>
                
                {shippingCost > 0 && (
                  <div className="p-3 bg-primary/5 dark:bg-primary-dark/10 rounded-lg text-xs text-primary dark:text-primary-light font-medium mt-1">
                    💡 Add ${(150 - cartTotal).toFixed(2)} more to qualify for Free Shipping!
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-baseline">
                <span className="font-bold text-base">Grand Total</span>
                <span className="text-2xl font-extrabold text-text-light dark:text-text-dark">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <button 
                onClick={handleCheckoutClick}
                className="w-full py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold glow-btn flex items-center justify-center gap-2 shadow-premium"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

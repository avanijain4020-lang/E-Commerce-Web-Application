import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import GlassCard from '../components/GlassCard.jsx';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';

export default function Checkout({ onNavigate, showToast }) {
  const { user } = useAuth();
  const { cart, cartTotal, clearCart, refreshCart } = useCart();
  const [processing, setProcessing] = useState(false);

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      onNavigate('login', { redirect: 'checkout' });
    } else if (cart.products.length === 0) {
      onNavigate('cart');
    }
  }, [user, cart, onNavigate]);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const shippingCost = cartTotal >= 150 ? 0 : 15;
  const taxCost = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingCost + taxCost;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.street.trim()) errors.street = 'Street is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.state.trim()) errors.state = 'State is required';
    if (!shippingAddress.postalCode.trim()) errors.postalCode = 'Postal code is required';
    
    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{16}$/)) {
      errors.number = 'Valid 16-digit card number is required';
    }
    if (!cardDetails.name.trim()) errors.name = 'Cardholder name is required';
    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      errors.expiry = 'Use MM/YY format';
    }
    if (!cardDetails.cvv.match(/^\d{3}$/)) {
      errors.cvv = '3-digit CVV is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix validation errors', 'error');
      return;
    }

    try {
      setProcessing(true);
      
      // Map cart products into Order payload format
      const orderProducts = cart.products.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

      // Send API request
      const order = await api.orders.create({
        products: orderProducts,
        shippingAddress
      });

      showToast('Order completed successfully!', 'success');
      
      // Clear Cart state
      await clearCart();
      await refreshCart();

      // Navigate to Dashboard
      onNavigate('dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (!user || cart.products.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
      {/* Back to Cart link */}
      <button 
        onClick={() => onNavigate('cart')}
        className="flex items-center gap-2 text-sm font-semibold text-text-mutedLight dark:text-text-mutedDark hover:text-primary transition-colors w-max"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
        <span>Return to cart</span>
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight">Checkout Securely</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Shipping Address */}
          <GlassCard hoverLift={false} className="flex flex-col gap-4">
            <h2 className="font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
              <span>Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  className={`px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                    formErrors.street ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {formErrors.street && <span className="text-xs text-red-500 font-semibold">{formErrors.street}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className={`px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                    formErrors.city ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {formErrors.city && <span className="text-xs text-red-500 font-semibold">{formErrors.city}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  className={`px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                    formErrors.state ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {formErrors.state && <span className="text-xs text-red-500 font-semibold">{formErrors.state}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleAddressChange}
                  className={`px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                    formErrors.postalCode ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {formErrors.postalCode && <span className="text-xs text-red-500 font-semibold">{formErrors.postalCode}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Country</label>
                <select
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold cursor-pointer"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="India">India</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Secure Payment */}
          <GlassCard hoverLift={false} className="flex flex-col gap-4">
            <h2 className="font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
              <span>Secure Payment Gateway</span>
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" />
                  <span>Card Number</span>
                </label>
                <input
                  type="text"
                  name="number"
                  placeholder="4111 2222 3333 4444"
                  maxLength={19}
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  className={`px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                    formErrors.number ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {formErrors.number && <span className="text-xs text-red-500 font-semibold">{formErrors.number}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                    className={`px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                      formErrors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {formErrors.name && <span className="text-xs text-red-500 font-semibold">{formErrors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Expiration Date</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    className={`px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                      formErrors.expiry ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {formErrors.expiry && <span className="text-xs text-red-500 font-semibold">{formErrors.expiry}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="***"
                    maxLength={3}
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    className={`px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                      formErrors.cvv ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {formErrors.cvv && <span className="text-xs text-red-500 font-semibold">{formErrors.cvv}</span>}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Summary & Checkout button */}
        <div className="lg:col-span-1">
          <div className="glass rounded-premium p-6 border border-slate-100 dark:border-slate-800/50 flex flex-col gap-6">
            <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
              Your Order
            </h3>

            {/* Product list preview */}
            <div className="flex flex-col gap-4 max-h-48 overflow-y-auto pr-1">
              {cart.products.map((item) => (
                <div key={item.productId._id} className="flex justify-between items-center text-sm gap-2">
                  <div className="flex items-center gap-3 truncate">
                    <img 
                      src={item.productId.image} 
                      alt={item.productId.name} 
                      className="h-9 w-9 rounded object-cover shrink-0"
                    />
                    <span className="truncate font-semibold text-text-light dark:text-text-dark">
                      {item.productId.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold shrink-0 text-text-mutedLight dark:text-text-mutedDark">
                    {item.quantity} x ${item.productId.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Prices summary */}
            <div className="flex flex-col gap-3 text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-text-mutedLight dark:text-text-mutedDark">
                <span>Items Subtotal</span>
                <span className="font-semibold text-text-light dark:text-text-dark">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-text-mutedLight dark:text-text-mutedDark">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-text-mutedLight dark:text-text-mutedDark">
                <span>Estimated Sales Tax (8%)</span>
                <span>${taxCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-baseline">
              <span className="font-bold text-base">Grand Total</span>
              <span className="text-2xl font-extrabold text-primary dark:text-primary-light">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout action */}
            <button 
              type="submit"
              disabled={processing}
              className="w-full py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold glow-btn shadow-premium flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Pay & Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

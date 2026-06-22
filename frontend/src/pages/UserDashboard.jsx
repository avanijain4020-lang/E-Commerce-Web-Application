import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import GlassCard from '../components/GlassCard.jsx';
import { ListSkeleton } from '../components/LoadingSkeleton.jsx';
import { 
  User as UserIcon, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Truck, 
  Gift, 
  ChevronRight 
} from 'lucide-react';

export default function UserDashboard({ onNavigate, showToast }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // orders, profile

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await api.orders.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load orders:', err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Stepper helper
  const getStatusStep = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'Processing': return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'Shipped': return <Truck className="h-5 w-5 text-secondary" />;
      case 'Delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
        <GlassCard hoverLift={false} className="p-4 flex flex-col items-center text-center gap-3">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-text-light dark:text-text-dark">{user.name}</span>
            <span className="text-xs text-text-mutedLight dark:text-text-mutedDark truncate max-w-[200px]">
              {user.email}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary dark:bg-primary-dark/25 dark:text-primary-light">
            {user.role} Account
          </span>
        </GlassCard>

        {/* Tab switchers */}
        <div className="flex md:flex-col gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 md:flex-none px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-sm'
                : 'glass hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light dark:text-text-dark'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>My Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:flex-none px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all flex items-center gap-2.5 ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-sm'
                : 'glass hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light dark:text-text-dark'
            }`}
          >
            <UserIcon className="h-4.5 w-4.5" />
            <span>Profile Details</span>
          </button>
        </div>
      </div>

      {/* Main dashboard content area */}
      <div className="flex-1 min-w-0">
        {activeTab === 'orders' ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Order History</h2>

            {loading ? (
              <ListSkeleton count={3} />
            ) : orders.length === 0 ? (
              <div className="w-full py-16 glass rounded-premium text-center flex flex-col items-center justify-center gap-4 border border-slate-100 dark:border-slate-800/50">
                <span className="text-3xl">📦</span>
                <h3 className="font-bold text-base">No Orders Placed Yet</h3>
                <p className="text-sm text-text-mutedLight dark:text-text-mutedDark max-w-xs">
                  Your purchase history is empty. Elevate your desk layout with our latest accessories.
                </p>
                <button 
                  onClick={() => onNavigate('products')}
                  className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-sm"
                >
                  Shop Now
                </button>
              </div>
            ) : selectedOrder ? (
              /* Detailed order view and tracking stepper */
              <div className="flex flex-col gap-6">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 w-max"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span>Back to all orders</span>
                </button>

                <GlassCard hoverLift={false} className="flex flex-col gap-6 border border-slate-150 dark:border-slate-800">
                  {/* Order header summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-text-mutedLight dark:text-text-mutedDark font-semibold">Order ID</span>
                      <span className="text-sm font-bold truncate max-w-xs">{selectedOrder._id}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-mutedLight dark:text-text-mutedDark font-semibold">Date Placed</span>
                      <span className="text-sm font-semibold">
                        {new Date(selectedOrder.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-mutedLight dark:text-text-mutedDark font-semibold">Total Amount</span>
                      <span className="text-sm font-extrabold text-primary dark:text-primary-light">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Stepper Status Tracker */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-text-light dark:text-text-dark">
                      Delivery Tracking Status
                    </h3>
                    
                    <div className="relative py-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2">
                      {/* Connection bar */}
                      <div className="absolute top-1/2 left-0 h-[2px] w-full bg-slate-200 dark:bg-slate-850 -translate-y-1/2 hidden md:block"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 hidden md:block transition-all duration-500"
                        style={{ width: `${(getStatusStep(selectedOrder.orderStatus) / 3) * 100}%` }}
                      ></div>

                      {/* Steps */}
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                        const activeIdx = getStatusStep(selectedOrder.orderStatus);
                        const isDone = idx <= activeIdx;
                        const isCurrent = idx === activeIdx;

                        return (
                          <div key={idx} className="z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2 bg-white dark:bg-slate-900 md:px-4 py-2 w-full md:w-auto">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                              isCurrent 
                                ? 'bg-primary text-white scale-110 ring-4 ring-primary/20 ring-offset-2 dark:ring-offset-slate-900' 
                                : isDone 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>
                              {idx === 0 ? <Clock className="h-5 w-5" /> : null}
                              {idx === 1 ? <Clock className="h-5 w-5" /> : null}
                              {idx === 2 ? <Truck className="h-5 w-5" /> : null}
                              {idx === 3 ? <CheckCircle className="h-5 w-5" /> : null}
                            </div>
                            <div className="flex flex-col md:items-center">
                              <span className={`text-sm font-bold ${isDone ? 'text-text-light dark:text-text-dark' : 'text-slate-400'}`}>
                                {step}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                                  Current Stage
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {selectedOrder.trackingNumber && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold flex items-center justify-between">
                        <span>DHL Express Tracking Code:</span>
                        <span className="font-extrabold text-secondary select-all">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Order items listing */}
                  <div className="flex flex-col gap-4 mt-2">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-text-light dark:text-text-dark">
                      Items In Order
                    </h3>
                    <div className="flex flex-col gap-3">
                      {selectedOrder.products.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-850 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                            <div className="flex flex-col">
                              <span className="font-bold">{item.name}</span>
                              <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">
                                Quantity: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="font-extrabold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address Summary */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-text-light dark:text-text-dark flex items-center gap-1.5">
                      <MapPin className="h-4.5 w-4.5 text-primary" />
                      <span>Shipping Address</span>
                    </h3>
                    <p className="text-sm text-text-mutedLight dark:text-text-mutedDark leading-relaxed pl-6">
                      {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, <br />
                      {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}, <br />
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </GlassCard>
              </div>
            ) : (
              /* All Orders List */
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div 
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="glass rounded-premium shadow-premium p-5 hover:shadow-premium-hover border border-slate-100 dark:border-slate-800/50 hover:border-primary/20 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-850 shrink-0">
                        {getStatusIcon(order.orderStatus)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-text-mutedLight dark:text-text-mutedDark font-semibold">
                          Order ID: {order._id.substring(0, 10)}...
                        </span>
                        <span className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs mt-0.5">
                          {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className="text-xs text-text-mutedLight dark:text-text-mutedDark mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-extrabold text-primary dark:text-primary-light">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded ${
                          order.orderStatus === 'Delivered' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Profile Details Tab */
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Account Profile</h2>
            
            <GlassCard hoverLift={false} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Full Name</span>
                  <span className="text-base font-semibold text-text-light dark:text-text-dark">{user.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Email Address</span>
                  <span className="text-base font-semibold text-text-light dark:text-text-dark">{user.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Permissions Level</span>
                  <span className="text-base font-semibold capitalize">{user.role}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">Registration Date</span>
                  <span className="text-base font-semibold flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>June 2026 (Demo Mode)</span>
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary-dark/10 text-xs text-primary dark:text-primary-light font-medium leading-relaxed flex items-start gap-2.5">
                <Gift className="h-4.5 w-4.5 shrink-0" />
                <span>You have active developer privileges. Switch roles in the admin dashboard panel to experience client vs administrator permissions workflows.</span>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}

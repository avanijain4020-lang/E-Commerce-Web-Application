import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api.js';
import GlassCard from '../components/GlassCard.jsx';
import { StatCardSkeleton, TableRowSkeleton } from '../components/LoadingSkeleton.jsx';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Box, 
  Edit, 
  Trash2, 
  Plus, 
  Check, 
  X,
  Truck,
  RotateCcw
} from 'lucide-react';

export default function AdminDashboard({ showToast }) {
  // Tabs: analytics, products, orders, users
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productPayload, setProductPayload] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Electronics',
    stock: ''
  });

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusVal, setOrderStatusVal] = useState('Pending');
  const [trackingNumberVal, setTrackingNumberVal] = useState('');

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.products.getAll({ limit: 100 });
      setProducts(data.products || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.admin.getOrders();
      setOrders(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.admin.getUsers();
      setUsers(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchAnalytics, fetchProducts, fetchOrders, fetchUsers]);

  // Products CRUD handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.products.update(editingProduct._id, productPayload);
        showToast('Product updated successfully', 'success');
      } else {
        await api.products.create(productPayload);
        showToast('Product created successfully', 'success');
      }
      setProductFormOpen(false);
      setEditingProduct(null);
      setProductPayload({ name: '', price: '', description: '', image: '', category: 'Electronics', stock: '' });
      fetchProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProductPayload({
      name: prod.name,
      price: prod.price,
      description: prod.description,
      image: prod.image,
      category: prod.category,
      stock: prod.stock
    });
    setProductFormOpen(true);
  };

  const handleDeleteProductClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.products.delete(id);
        showToast('Product deleted', 'info');
        fetchProducts();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  // Orders status handlers
  const handleOrderEditClick = (order) => {
    setSelectedOrder(order);
    setOrderStatusVal(order.orderStatus);
    setTrackingNumberVal(order.trackingNumber || '');
    setOrderModalOpen(true);
  };

  const handleOrderUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.admin.updateOrderStatus(selectedOrder._id, {
        orderStatus: orderStatusVal,
        trackingNumber: trackingNumberVal
      });
      showToast('Order status updated', 'success');
      setOrderModalOpen(false);
      fetchOrders();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Users Privilege toggle handlers
  const handleRoleToggle = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.admin.updateUserRole(userId, { role: nextRole });
      showToast(`User role updated to ${nextRole}`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.admin.deleteUser(userId);
        showToast('User account deleted', 'info');
        fetchUsers();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Workspace</h1>
          <p className="text-sm text-text-mutedLight dark:text-text-mutedDark">
            Manage site catalog, shipment orders, and user privileges.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 flex-wrap">
          {['analytics', 'products', 'orders', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'glass text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ANALYTICS VIEW */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-8">
          {/* Stats grid cards */}
          {loading && !analytics ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => <StatCardSkeleton key={idx} />)}
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard hoverLift={false} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-mutedLight dark:text-text-mutedDark uppercase tracking-wider">Total Sales</span>
                  <span className="text-2xl font-extrabold text-primary dark:text-primary-light mt-1">
                    ${analytics.summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-3 bg-primary/10 text-primary rounded-xl"><DollarSign className="h-6 w-6" /></div>
              </GlassCard>

              <GlassCard hoverLift={false} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-mutedLight dark:text-text-mutedDark uppercase tracking-wider">Total Orders</span>
                  <span className="text-2xl font-extrabold text-secondary mt-1">{analytics.summary.totalOrders}</span>
                </div>
                <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><ShoppingBag className="h-6 w-6" /></div>
              </GlassCard>

              <GlassCard hoverLift={false} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-mutedLight dark:text-text-mutedDark uppercase tracking-wider">Products Live</span>
                  <span className="text-2xl font-extrabold text-accent mt-1">{analytics.summary.totalProducts}</span>
                </div>
                <div className="p-3 bg-accent/10 text-accent rounded-xl"><Box className="h-6 w-6" /></div>
              </GlassCard>

              <GlassCard hoverLift={false} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-mutedLight dark:text-text-mutedDark uppercase tracking-wider">Registered Users</span>
                  <span className="text-2xl font-extrabold text-green-500 mt-1">{analytics.summary.totalUsers}</span>
                </div>
                <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Users className="h-6 w-6" /></div>
              </GlassCard>
            </div>
          ) : null}

          {/* Sales chart */}
          {analytics && (
            <GlassCard hoverLift={false} className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Sales Revenue Trend (Past 7 Days)</h3>
              <div className="h-72 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.salesOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickLine={false} tickFormatter={(tick) => tick.substring(5)} style={{ fontSize: '11px', fontWeight: '600' }} />
                    <YAxis tickLine={false} tickFormatter={(tick) => `$${tick}`} style={{ fontSize: '11px', fontWeight: '600' }} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Sales']} contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                    <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}

          {/* Recent orders */}
          {analytics && (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Recent Order Transactions</h3>
              <div className="glass border border-slate-100 dark:border-slate-800/50 rounded-premium overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50">
                      <tr>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight dark:text-text-mutedDark">Order ID</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight dark:text-text-mutedDark">Customer</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight dark:text-text-mutedDark">Total</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight dark:text-text-mutedDark">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentOrders.map((ord) => (
                        <tr key={ord._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="px-6 py-4 font-bold truncate max-w-[120px]">{ord._id}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold">{ord.customerName}</span>
                              <span className="text-xs text-text-mutedLight">{ord.customerEmail}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-extrabold">${ord.totalAmount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                              ord.orderStatus === 'Delivered' 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Product Catalog</h3>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setProductPayload({ name: '', price: '', description: '', image: '', category: 'Electronics', stock: '' });
                setProductFormOpen(true);
              }}
              className="px-4 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Product form Modal/drawer */}
          {productFormOpen && (
            <GlassCard hoverLift={false} className="border border-slate-150 dark:border-slate-800">
              <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-base">{editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}</h4>
                  <button type="button" onClick={() => setProductFormOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-text-mutedLight">Product Name</label>
                    <input required type="text" value={productPayload.name} onChange={e => setProductPayload(prev => ({ ...prev, name: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-text-mutedLight">Price ($)</label>
                    <input required type="number" step="0.01" value={productPayload.price} onChange={e => setProductPayload(prev => ({ ...prev, price: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-text-mutedLight">Stock Units</label>
                    <input required type="number" value={productPayload.stock} onChange={e => setProductPayload(prev => ({ ...prev, stock: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-text-mutedLight">Category</label>
                    <select value={productPayload.category} onChange={e => setProductPayload(prev => ({ ...prev, category: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm font-semibold">
                      <option value="Electronics">Electronics</option>
                      <option value="Audio">Audio</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Furniture">Furniture</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-text-mutedLight">Image URL</label>
                    <input required type="text" placeholder="https://images.unsplash.com/..." value={productPayload.image} onChange={e => setProductPayload(prev => ({ ...prev, image: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm" />
                  </div>
                  <div className="md:col-span-3 flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-text-mutedLight">Description</label>
                    <textarea required rows={3} value={productPayload.description} onChange={e => setProductPayload(prev => ({ ...prev, description: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm resize-none"></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setProductFormOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm transition-colors">Save Product</button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* Products Table List */}
          <div className="glass border border-slate-100 dark:border-slate-800/50 rounded-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Item</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Category</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Price</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Stock</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && products.length === 0 ? (
                    Array.from({ length: 4 }).map((_, idx) => <TableRowSkeleton key={idx} cols={5} />)
                  ) : (
                    products.map((prod) => (
                      <tr key={prod._id} className="border-b border-slate-100 dark:border-slate-850 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={prod.image} alt={prod.name} className="h-10 w-10 rounded object-cover shrink-0" />
                            <span className="font-bold truncate max-w-[180px]">{prod.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold">{prod.category}</td>
                        <td className="px-6 py-4 font-extrabold">${prod.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${prod.stock === 0 ? 'text-red-500' : 'text-text-light dark:text-text-dark'}`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditProductClick(prod)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors" title="Edit"><Edit className="h-4.5 w-4.5" /></button>
                            <button onClick={() => handleDeleteProductClick(prod._id)} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 transition-colors" title="Delete"><Trash2 className="h-4.5 w-4.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-6">
          <h3 className="font-bold text-lg">Shipping Orders</h3>

          {orderModalOpen && selectedOrder && (
            <GlassCard hoverLift={false} className="border border-slate-150 dark:border-slate-800 max-w-xl">
              <form onSubmit={handleOrderUpdateSubmit} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-base">Update Order Status</h4>
                  <button type="button" onClick={() => setOrderModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-text-mutedLight">Status stage</label>
                    <select 
                      value={orderStatusVal} 
                      onChange={e => setOrderStatusVal(e.target.value)} 
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-text-mutedLight">Courier Tracking Code (e.g. DHL/FedEx)</label>
                    <input 
                      type="text" 
                      placeholder="DHL-92841"
                      value={trackingNumberVal} 
                      onChange={e => setTrackingNumberVal(e.target.value)} 
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setOrderModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm transition-colors">Apply Changes</button>
                </div>
              </form>
            </GlassCard>
          )}

          <div className="glass border border-slate-100 dark:border-slate-800/50 rounded-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Order ID</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Customer</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Total Amount</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Status</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && orders.length === 0 ? (
                    Array.from({ length: 4 }).map((_, idx) => <TableRowSkeleton key={idx} cols={5} />)
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord._id} className="border-b border-slate-100 dark:border-slate-850 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="px-6 py-4 font-bold truncate max-w-[120px]">{ord._id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold">{ord.customerName}</span>
                            <span className="text-xs text-text-mutedLight">{ord.customerEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-extrabold">${ord.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                            ord.orderStatus === 'Delivered' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleOrderEditClick(ord)} 
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                            title="Edit Status"
                          >
                            <Truck className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. USERS WORKSPACE */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-6">
          <h3 className="font-bold text-lg">User Access Privilege Controls</h3>

          <div className="glass border border-slate-100 dark:border-slate-800/50 rounded-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Name</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Email</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight">Role Privilege</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-mutedLight text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && users.length === 0 ? (
                    Array.from({ length: 4 }).map((_, idx) => <TableRowSkeleton key={idx} cols={4} />)
                  ) : (
                    users.map((usr) => (
                      <tr key={usr._id} className="border-b border-slate-100 dark:border-slate-850 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="px-6 py-4 font-bold">{usr.name}</td>
                        <td className="px-6 py-4 font-semibold text-text-mutedLight dark:text-text-mutedDark">{usr.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            usr.role === 'admin' 
                              ? 'bg-secondary/10 text-secondary' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleRoleToggle(usr._id, usr.role)} 
                              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                              title="Toggle Role Permission"
                            >
                              <RotateCcw className="h-4.5 w-4.5" />
                            </button>
                            <button 
                              onClick={() => handleUserDelete(usr._id)} 
                              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api.js';
import { ProductCardSkeleton } from '../components/LoadingSkeleton.jsx';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function ProductList({ onNavigate, initialFilters = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & pagination states
  const [search, setSearch] = useState(initialFilters.search || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.products.getAll({
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit: 8 // Show 8 items per page
      });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, sortBy, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  const handleCategoryChange = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPage(1);
  };

  const categories = ['All', 'Electronics', 'Audio', 'Accessories'];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Header and Results Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Studio Shop</h1>
          <p className="text-sm text-text-mutedLight dark:text-text-mutedDark">
            {loading ? 'Finding workspace gear...' : `Showing ${totalProducts} premium products`}
          </p>
        </div>

        {/* Search Input bar */}
        <form onSubmit={handleSearchSubmit} className="flex relative items-center w-full md:w-80">
          <input
            type="text"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-200"
          />
          <Search className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
        </form>
      </div>

      {/* Main Grid: Filters & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="glass rounded-premium p-6 border border-slate-100 dark:border-slate-800/50 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4">
              <span className="font-bold text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Filters</span>
              </span>
              <button 
                onClick={handleClearFilters}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark">
                Category
              </span>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full lg:rounded-premium text-left text-sm font-semibold transition-all duration-200 ${
                      (cat === 'All' && !category) || category === cat
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-text-light/80 dark:text-text-dark/80 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark">
                Price Range
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>

            {/* Sorting */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark">
                Sort By
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none font-semibold cursor-pointer"
                >
                  <option value="newest">Newest Releases</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="nameAsc">Alphabetical (A-Z)</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="w-full py-20 glass rounded-premium flex flex-col items-center justify-center text-center gap-4 border border-slate-100 dark:border-slate-800/50">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-bold">No Products Found</h3>
              <p className="text-sm text-text-mutedLight dark:text-text-mutedDark max-w-sm">
                We couldn't find any products matching your filters. Try adjusting your search term or clearing filters.
              </p>
              <button 
                onClick={handleClearFilters}
                className="mt-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div 
                    key={product._id}
                    onClick={() => onNavigate('product-details', { id: product._id })}
                    className="group cursor-pointer glass rounded-premium shadow-premium p-4 flex flex-col gap-4 border border-slate-100 dark:border-slate-800/50 hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-full aspect-square bg-slate-100 dark:bg-slate-850 rounded-premium overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {product.stock === 0 ? (
                        <span className="absolute top-3 left-3 px-2 py-1 rounded bg-slate-500 text-[10px] font-bold text-white uppercase tracking-wider">
                          Out of Stock
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="absolute top-3 left-3 px-2 py-1 rounded bg-red-500 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                          Low Stock
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-text-mutedLight dark:text-text-mutedDark uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-base leading-tight text-text-light dark:text-text-dark group-hover:text-primary transition-colors truncate">
                        {product.name}
                      </h3>
                      
                      {/* Mock ratings */}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] text-text-mutedLight dark:text-text-mutedDark font-medium">(5.0)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/50">
                      <span className="text-lg font-extrabold text-text-light dark:text-text-dark">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        View Specs
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Section */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="p-2 rounded-full border border-slate-200 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light dark:text-text-dark transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-semibold text-text-mutedLight dark:text-text-mutedDark">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-2 rounded-full border border-slate-200 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 text-text-light dark:text-text-dark transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

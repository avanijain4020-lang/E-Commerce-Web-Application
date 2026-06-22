import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import GlassCard from '../components/GlassCard.jsx';
import { ProductCardSkeleton } from '../components/LoadingSkeleton.jsx';
import { 
  ArrowRight, 
  Sparkles, 
  Monitor, 
  Headphones, 
  Keyboard, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Star
} from 'lucide-react';

export default function Home({ onNavigate, showToast }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Load products, take first 4 as featured
        const data = await api.products.getAll({ limit: 4 });
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load featured products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', icon: <Monitor className="h-6 w-6 text-primary" />, count: '3 Products' },
    { name: 'Audio', icon: <Headphones className="h-6 w-6 text-secondary" />, count: '1 Product' },
    { name: 'Accessories', icon: <Keyboard className="h-6 w-6 text-accent" />, count: '2 Products' },
  ];

  const testimonials = [
    { name: 'Marcus Vance', role: 'Software Engineer', comment: 'The Minimalist Keyboard completely transformed my desk setup. The build quality is unmatched.', rating: 5 },
    { name: 'Elena Rostova', role: 'Digital Artist', comment: 'Studio Wireless Headphones deliver absolute clarity. ANC is perfect for focusing in noisy coffee shops.', rating: 5 },
    { name: 'Kenji Sato', role: 'Tech Enthusiast', comment: 'Fast shipping, premium packaging, and beautiful design. ApexCart is my go-to for workspace gear.', rating: 5 },
  ];

  return (
    <div className="w-full flex flex-col gap-20 pb-20">
      {/* Hero Banner Section */}
      <section className="relative w-full py-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent dark:from-primary/10 dark:via-secondary/5 dark:to-transparent rounded-b-3xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-semibold text-primary dark:text-primary-light mb-6 animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span>New Studio Collection Just Dropped</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text-light dark:text-text-dark max-w-4xl leading-tight">
          Elevate Your Workspace with{' '}
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Premium Aesthetics
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-text-mutedLight dark:text-text-mutedDark max-w-2xl mt-6 leading-relaxed">
          Discover hand-crafted, minimalist desk electronics, mechanical keyboards, audio gears, and lifestyle accessories designed for digital builders.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button 
            onClick={() => onNavigate('products')}
            className="px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold glow-btn shadow-premium flex items-center gap-2 group transition-all duration-200"
          >
            <span>Browse Collection</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => onNavigate('products', { category: 'Electronics' })}
            className="px-8 py-4 rounded-full glass hover:bg-slate-100 dark:hover:bg-slate-800/50 font-semibold text-text-light dark:text-text-dark transition-all duration-200"
          >
            View Electronics
          </button>
        </div>
      </section>

      {/* Brand Value Propositions */}
      <section className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <ShieldCheck className="h-8 w-8 text-primary" />, title: 'Premium Warranty', desc: 'Every product comes backed by a 2-year warranty and lifetime support.' },
          { icon: <Truck className="h-8 w-8 text-secondary" />, title: 'Global Express Delivery', desc: 'Secure packaging and tracked delivery worldwide. Free on orders above $150.' },
          { icon: <RefreshCw className="h-8 w-8 text-accent" />, title: '30-Day Returns', desc: 'Not completely satisfied? Return your product in original packaging, no questions asked.' }
        ].map((item, idx) => (
          <GlassCard key={idx} hoverLift={false} className="flex gap-4 items-start">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
              {item.icon}
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-bold text-base">{item.title}</h3>
              <p className="text-sm text-text-mutedLight dark:text-text-mutedDark leading-relaxed">{item.desc}</p>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight">Browse by Category</h2>
          <p className="text-sm text-text-mutedLight dark:text-text-mutedDark">Curated designer workspace configurations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => onNavigate('products', { category: cat.name })}
              className="group cursor-pointer glass rounded-premium shadow-premium p-6 flex items-center justify-between hover:shadow-premium-hover border border-slate-100 dark:border-slate-800/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-850 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-text-light dark:text-text-dark">{cat.name}</span>
                  <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">{cat.count}</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-primary transition-all duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">Featured Releases</h2>
            <p className="text-sm text-text-mutedLight dark:text-text-mutedDark">Aesthetic additions to complete your workflow</p>
          </div>
          <button 
            onClick={() => onNavigate('products')}
            className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All Products</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div 
                key={product._id}
                onClick={() => onNavigate('product-details', { id: product._id })}
                className="group cursor-pointer glass rounded-premium shadow-premium p-4 flex flex-col gap-4 border border-slate-100 dark:border-slate-800/50 hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Gallery Mock */}
                <div className="w-full aspect-square bg-slate-100 dark:bg-slate-850 rounded-premium overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.stock <= 5 && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded bg-red-500 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                      Low Stock
                    </span>
                  )}
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
        )}
      </section>

      {/* Customer Reviews Section */}
      <section className="w-full bg-slate-50 dark:bg-slate-900/50 py-16 px-6 md:px-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Verified Reviews</h2>
            <p className="text-sm text-text-mutedLight dark:text-text-mutedDark">Join thousands of productive creators using our gear</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <GlassCard key={idx} hoverLift={false} className="flex flex-col gap-4 bg-white/40 dark:bg-slate-950/20">
                <div className="flex items-center gap-1">
                  {Array.from({ length: test.rating }).map((_, s) => (
                    <Star key={s} className="h-4.5 w-4.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-text-light/90 dark:text-text-dark/95 italic leading-relaxed">
                  "{test.comment}"
                </p>
                <div className="flex flex-col mt-auto">
                  <span className="font-bold text-sm text-text-light dark:text-text-dark">{test.name}</span>
                  <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">{test.role}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

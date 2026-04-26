import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft, Fish, ShieldCheck, ShoppingBag, Star, Utensils, ChefHat, Flame, Truck, Thermometer, Users, CheckCircle, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { useToast } from '../components/Toast';
import { ProductCard } from './ConsumerHome';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, categories } = useStore();
  const { showToast } = useToast();
  
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'newest'>('rating');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Resolve category name
  const categoryName = location.state?.categoryName || 
    (categoryId === 'all' ? 'All' : (categoryId ? categoryId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ''));

  // Get sub-categories/types from current products
  const subTypes = Array.from(new Set(products
    .filter(p => categoryName === 'All' ? true : p.category === categoryName)
    .map(p => p.type || 'Other')
  )).filter(Boolean);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categoryId]);

  const filteredProducts = products
    .filter(p => {
      const matchesCategory = categoryName && categoryName !== 'All' ? p.category === categoryName : true;
      const matchesTab = activeTab === 'All' ? true : p.type === activeTab;
      const matchesStock = inStockOnly ? p.stock > 0 : true;
      return matchesCategory && matchesTab && matchesStock && p.isVisibleConsumer;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.id - a.id;
    });

  const topPicks = [...products]
    .filter(p => (categoryName === 'All' ? true : p.category === categoryName) && p.isVisibleConsumer)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const categoryAccents: Record<string, string> = {
    'Marine Fish': '#1a3c5a', // Deep Ocean Blue
    'Freshwater Fish': '#0f766e', // Teal
    'Shellfish': '#0f766e', // Teal
    'Exotic': '#581c87', // Muted Purple
    'Dry Fish': '#92400e', // Warm Amber
    'All': '#1a3c5a'
  };

  const accentColor = categoryAccents[categoryName] || '#1a3c5a';

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favorites.includes(id);
    if (!isFav) {
      showToast("Added to your wishlist", "success");
    }
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans pb-20 relative overflow-hidden">
      {/* Premium Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,60,90,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(26,60,90,0.03),transparent_40%)] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] text-brand-primary opacity-[0.02] rotate-12 pointer-events-none">
        <Fish size={600} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-[5%] left-[-5%] text-brand-primary opacity-[0.02] -rotate-12 pointer-events-none">
        <Waves size={800} strokeWidth={0.5} />
      </div>

      <style>{`
        .category-accent-text { color: ${accentColor}; }
        .category-accent-bg { background-color: ${accentColor}15; color: ${accentColor}; }
        .category-accent-border { border-color: ${accentColor}; }
      `}</style>
      {/* Header / Navbar fallback for Category Page */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/consumer')}>
            <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 w-auto" />
            <span className="text-lg font-bold text-brand-primary">Kadal 2 Kadaai</span>
          </div>
        </div>
      </header>

      {/* Refined Category Header */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Immersive Background Layers */}
        <div className="absolute inset-0 category-accent-bg opacity-[0.08] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,60,90,0.05),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-[#fcfdfe] pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button 
              onClick={() => navigate('/consumer')}
              className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-400 hover:text-brand-primary transition-colors group w-fit"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Marketplace
            </button>
            <nav className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Link to="/consumer" className="hover:text-brand-primary transition-colors">Home</Link>
              <ChevronRight size={14} className="opacity-40" />
              <span className="opacity-60">Category</span>
              <ChevronRight size={14} className="opacity-40" />
              <span className="category-accent-text font-black">{categoryName}</span>
            </nav>
          </div>

          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tight">
                {categoryName}
              </h1>
              <span className="category-accent-bg px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest w-fit">
                {filteredProducts.length} Products Available
              </span>
            </div>
            <p className="text-gray-500 text-base md:text-xl font-medium leading-relaxed max-w-2xl">
              Discover the finest selection of {categoryName.toLowerCase()}, ethically sourced and delivered fresh to your doorstep daily.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Sticky Filter Bar */}
      <div className="sticky top-0 z-50 bg-[#fcfdfe]/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 py-2">
            {['All', ...subTypes].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  activeTab === tab 
                    ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-brand-primary/50 hover:text-brand-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6 shrink-0">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-10 h-5 rounded-full relative transition-colors ${inStockOnly ? 'bg-brand-primary' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${inStockOnly ? 'left-6' : 'left-1'}`} />
              </div>
              <span className="text-xs font-bold text-gray-600 group-hover:text-brand-primary transition-colors">In Stock Only</span>
            </label>

            <div className="h-8 w-px bg-gray-100" />

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price">Price</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-12 flex-1">

        {/* Category Highlights */}
        <section className="mb-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Fish size={24} />, title: "Freshly Sourced", desc: "Caught and delivered daily" },
              { icon: <ShieldCheck size={24} />, title: "Hygienic Process", desc: "Safe & clean handling" },
              { icon: <ShoppingBag size={24} />, title: "Chef Approved", desc: "Best for home & dining" },
              { icon: <Star size={24} />, title: "Premium Quality", desc: "High protein standards" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white/90 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-sm flex flex-col gap-6 hover:shadow-md transition-all group cursor-default relative overflow-hidden"
              >
                <div className="absolute inset-0 category-accent-bg opacity-[0.03] pointer-events-none" />
                <div className="w-14 h-14 category-accent-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10">
                  {item.icon}
                </div>
                <div className="relative z-10">
                  <h4 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Top Picks Section */}
        {topPicks.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Most Popular Choices</h3>
                <p className="text-sm text-gray-500 font-medium">Curated top picks from our premium selection</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {topPicks.map((product) => (
                <div key={`top-${product.id}`} className="relative group">
                  <div className="absolute -top-3 left-6 z-10 bg-brand-secondary text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/30 uppercase tracking-widest flex items-center gap-2">
                    <Star size={10} fill="currentColor" />
                    Top Pick
                  </div>
                  <ProductCard 
                    product={product}
                    onCartAdd={() => { showToast(`Added ${product.name} to cart`, 'success') }}
                    onFavoriteToggle={(e) => toggleFavorite(product.id, e)}
                    isFavorite={favorites.includes(product.id)}
                    onNavigate={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Perfect For Section */}
        <section className="mb-24">
          <h3 className="text-xl font-bold text-gray-900 mb-8 ml-1">Perfect For Your Needs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: <Utensils size={20} />, label: "Restaurants" },
              { icon: <ChefHat size={20} />, label: "Home Cooking" },
              { icon: <Flame size={20} />, label: "Grilling & BBQ" },
              { icon: <Truck size={20} />, label: "Bulk Buying" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/50 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="w-10 h-10 bg-brand-primary/5 text-brand-primary rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* All Products Grid Section */}
        <section id="product-listing" className="bg-white/30 backdrop-blur-md -mx-4 md:-mx-6 px-4 md:px-6 py-16 md:py-24 rounded-[40px] md:rounded-[60px] border border-white/50 shadow-inner">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl md:text-4xl font-black text-gray-950 tracking-tight">All Products</h3>
                <span className="category-accent-bg px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-1">
                  {filteredProducts.length} Results
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest hidden md:block">Refine your search</p>
                <div className="h-4 w-px bg-gray-200 hidden md:block" />
                <p className="text-gray-400 font-medium text-sm italic">Showing premium {categoryName.toLowerCase()} selection</p>
              </div>
            </div>

            {/* Product Grid */}
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onCartAdd={() => { showToast(`Added ${product.name} to cart`, 'success') }}
                      onFavoriteToggle={(e) => toggleFavorite(product.id, e)}
                      isFavorite={favorites.includes(product.id)}
                      onNavigate={() => navigate(`/product/${product.id}`)}
                    />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-32 flex flex-col items-center justify-center bg-white/50 rounded-3xl border border-dashed border-gray-200"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                      <ArrowLeft size={24} className="rotate-180" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No products available</h3>
                    <p className="text-gray-500 text-sm">We couldn't find any items matching your filters.</p>
                    <button 
                      onClick={() => {
                        setActiveTab('All');
                        setInStockOnly(false);
                      }}
                      className="mt-6 px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Post-Grid Trust Section */}
        <section className="mt-24 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <CheckCircle size={24} />, title: "Freshness Guaranteed", desc: "Rigorous quality checks for every single catch" },
              { icon: <Users size={24} />, title: "Verified Suppliers", desc: "Directly sourced from trusted partner boats" },
              { icon: <Thermometer size={24} />, title: "Maintained Cold Chain", desc: "Ensuring 100% freshness during transit" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 bg-white/40 border border-white/60 rounded-3xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-950 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

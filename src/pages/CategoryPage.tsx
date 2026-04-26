import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft, Fish, ShieldCheck, ShoppingBag, Star } from 'lucide-react';
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
  
  // Resolve category name
  const categoryName = location.state?.categoryName || 
    (categoryId === 'all' ? 'All' : (categoryId ? categoryId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ''));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categoryId]);

  const filteredProducts = products
    .filter(p => {
      const matchesCategory = categoryName && categoryName !== 'All' ? p.category === categoryName : true;
      return matchesCategory && p.isVisibleConsumer;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.id - a.id;
    });

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,60,90,0.03),transparent_50%)] pointer-events-none" />
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
      </header>

      {/* Category Hero Banner */}
      <section className="relative h-[250px] md:h-[300px] overflow-hidden bg-brand-primary">
        <div className="absolute inset-0">
          <img 
            src={
              categoryName === 'Marine Fish' ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1600' :
              categoryName === 'Freshwater Fish' ? 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1600' :
              categoryName === 'Shellfish' ? 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=1600' :
              'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=1600'
            }
            className="w-full h-full object-cover object-center opacity-70"
            alt={categoryName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f]/60 via-transparent to-transparent" />
        </div>
        <div className="relative h-full max-w-[1600px] mx-auto px-6 flex flex-col justify-center items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl text-white font-bold mb-3 drop-shadow-xl">{categoryName}</h1>
            <p className="text-gray-200 text-sm md:text-lg max-w-lg font-medium opacity-90">
              Freshly sourced, high-quality {categoryName.toLowerCase()} seafood delivered directly to you.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8 flex-1">
        
        {/* Back Button and Breadcrumb */}
        <div className="mb-12">
          <button 
            onClick={() => navigate('/consumer')}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all mb-6 shadow-sm group active:scale-95"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </button>

          <nav className="flex items-center gap-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            <Link to="/consumer" className="hover:text-brand-primary flex items-center gap-1 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="opacity-40" />
            <span className="opacity-70">Category</span>
            <ChevronRight size={14} className="opacity-40" />
            <span className="font-black category-accent-text">{categoryName}</span>
          </nav>
        </div>

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
                className="bg-white/90 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-sm flex flex-col gap-6 hover:shadow-md transition-all group cursor-default"
              >
                <div className="w-14 h-14 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Divider / Section Header */}
        <div className="border-t border-gray-100/80 pt-16 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tight relative">
                  {categoryName}
                  <div className="absolute -bottom-3 left-0 w-1/3 h-1.5 category-accent-text bg-current rounded-full opacity-20" />
                </h2>
                <span className="category-accent-bg px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mt-1">
                  {filteredProducts.length} Items
                </span>
              </div>
              <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed">Showing the finest selection of ethically sourced seafood.</p>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[240px]">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Sort Collection</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all cursor-pointer shadow-sm hover:border-gray-300"
              >
                <option value="rating">🏆 Top Rated First</option>
                <option value="price">💰 Price: Low to High</option>
                <option value="newest">✨ New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
                className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <ArrowLeft size={24} className="rotate-180" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products available</h3>
                <p className="text-gray-500 text-sm">We couldn't find any items in this category right now.</p>
                <button 
                  onClick={() => navigate('/consumer')}
                  className="mt-6 px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Back to Store
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}

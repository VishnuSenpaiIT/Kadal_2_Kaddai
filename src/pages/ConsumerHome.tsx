import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  MapPin, 
  Truck, 
  ShieldCheck,
  Fish,
  Waves,
  Heart,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useStore, Product } from '../lib/store';

// Hardcoded categories removed to use dynamic store categories

export interface ProductProps {
  product: Product;
  onCartAdd: () => void;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  isFavorite: boolean;
  onNavigate: () => void;
  key?: React.Key;
}

export function ProductCard({ product, onCartAdd, onFavoriteToggle, isFavorite, onNavigate }: ProductProps) {
  const isOutOfStock = (product.stock + product.incomingStock - product.soldToday) <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onNavigate}
      className={cn(
        "group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full",
        isOutOfStock && "opacity-75 grayscale-[0.5]"
      )}
    >
      <div className="relative h-40 md:h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <ImageIcon size={24} md:size={48} strokeWidth={1} />
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-center px-2">No Image</span>
          </div>
        )}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1">
          <span className="bg-white/90 backdrop-blur px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase text-brand-primary">
            {product.origin}
          </span>
          {isOutOfStock && (
            <span className="bg-red-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase text-center">
              Sold Out
            </span>
          )}
        </div>
        <button 
          onClick={onFavoriteToggle}
          className={cn(
            "absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
            isFavorite ? "bg-red-50 text-red-500" : "bg-white/90 backdrop-blur text-gray-400 hover:text-red-500"
          )}
        >
          <Heart size={14} md:size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="p-3 md:p-6 flex flex-col flex-1">
        <h3 className="text-sm md:text-2xl mb-1 md:mb-2 text-gray-950 font-sans font-bold group-hover:text-brand-primary transition-colors leading-tight line-clamp-2">{product.name}</h3>
        <p className="text-gray-400 text-[10px] md:text-sm mb-3 md:mb-6 flex items-center gap-1 opacity-80">
          <MapPin size={10} md:size={12} /> {product.origin}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-auto gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-lg md:text-3xl font-bold text-brand-primary tracking-tight">₹{product.price}</span>
            <span className="text-gray-400 text-[10px] md:text-sm mb-1">/{product.unit}</span>
          </div>
          <button 
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onCartAdd();
            }}
            className="w-full sm:w-auto bg-brand-primary text-white px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl hover:bg-brand-secondary transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={14} md:size={18} />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ConsumerHome() {
  const { products: PRODUCTS, categories } = useStore();
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=2000",
      title: "Fresh Catch Delivered Daily",
      subtitle: "Premium seafood sourced directly from trusted suppliers"
    },
    {
      image: "https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?auto=format&fit=crop&q=80&w=2000",
      title: "Ocean to Table Quality",
      subtitle: "Experience the freshest selection of sustainably caught fish"
    },
    {
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=2000",
      title: "Culinary Grade Seafood",
      subtitle: "Used by top chefs, now available for your home kitchen"
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);



  const topPicks = PRODUCTS.filter(p => p.isVisibleConsumer).sort((a, b) => b.rating - a.rating).slice(0, 8);
  const recommendedProducts = PRODUCTS.filter(p => p.isVisibleConsumer).sort((a, b) => a.price - b.price).slice(0, 6);

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

  const scrollToProducts = () => {
    const el = document.getElementById('marketplace-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0" 
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 md:h-10 w-auto" />
            <span className="text-lg md:text-2xl font-bold text-brand-primary truncate">Kadal 2 Kadaai</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button onClick={scrollToProducts} className="hover:text-brand-primary transition-colors">Marketplace</button>
            <button onClick={() => navigate('/sustainability')} className="hover:text-brand-primary transition-colors">Sustainability</button>
            <button onClick={() => navigate('/recipes')} className="hover:text-brand-primary transition-colors">Recipes</button>
            <button onClick={() => navigate('/b2b')} className="hover:text-brand-primary transition-colors">Wholesale</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowSearch(true)}
            >
              <Search size={20} />
            </button>
            <button 
              className="relative p-2 text-gray-600 hover:text-brand-primary transition-colors"
              onClick={() => setShowCart(true)}
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section Carousel */}
      <section 
        className="relative h-[calc(100vh-73px)] min-h-[600px] overflow-hidden bg-brand-primary"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <motion.img 
              key={`img-${currentSlide}`}
              src={slides[currentSlide].image}
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 8, ease: "linear" }}
              className="w-full h-full object-cover object-center opacity-80"
              alt={slides[currentSlide].title}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f]/50 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03] pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] pointer-events-none" />
          </motion.div>
        </AnimatePresence>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[5%] text-brand-secondary opacity-[0.08]"
          >
            <Fish size={280} strokeWidth={0.5} />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 40, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] left-[-5%] text-white opacity-[0.05]"
          >
            <Waves size={450} strokeWidth={0.5} />
          </motion.div>
        </div>

        <div className="relative h-full w-full px-10 md:px-20 flex flex-col justify-center items-start z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-[600px] h-[320px] md:h-[400px] flex flex-col justify-center"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl text-white font-bold mb-4 leading-[1.1] drop-shadow-2xl">
                {slides[currentSlide].title.split(' ').slice(0, -2).join(' ')} <br/>
                {slides[currentSlide].title.split(' ').slice(-2).join(' ')}
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-6 font-medium leading-relaxed drop-shadow-lg opacity-90">
                {slides[currentSlide].subtitle}
              </p>
              <div className="flex flex-row flex-wrap gap-4">
                <button 
                  onClick={scrollToProducts}
                  className="bg-brand-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-secondary/90 transition-all active:scale-95 shadow-xl shadow-orange-500/20"
                >
                  Explore Products
                </button>
                <button 
                  onClick={scrollToProducts}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all active:scale-95"
                >
                  View Top Picks
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                currentSlide === index ? "bg-brand-secondary w-10" : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        {/* Image Preloader */}
        <div className="hidden">
          {slides.map((slide, i) => (
            <img key={i} src={slide.image} alt="preload" />
          ))}
        </div>
      </section>

      <div className="relative z-40 -mt-20 max-w-[1600px] mx-auto px-4 md:px-6 pt-20 pb-16 md:pb-24 bg-white rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.1)]">
        {/* Category Cards Section */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Browse Categories</h2>
            <p className="text-gray-500 text-lg md:text-xl">Find what you need quickly</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            <button
              onClick={() => {
                navigate('/category/all', { state: { categoryName: 'All' } });
              }}
              className="relative h-32 md:h-48 rounded-2xl md:rounded-[24px] overflow-hidden group shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 text-left w-full"
            >
              <img src="https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=800" alt="All Seafood" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <span className="text-white font-bold text-base md:text-xl drop-shadow-md">All</span>
                <span className="text-gray-200 text-[10px] md:text-xs mt-1 font-medium tracking-wide drop-shadow-sm">View full collection</span>
              </div>
            </button>
            {categories.filter(c => c.isVisibleConsumer).map(cat => {
              const bgImage = 
                cat.name === 'Marine Fish' ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' :
                cat.name === 'Freshwater Fish' ? 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800' :
                cat.name === 'Shellfish' ? 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800' :
                'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=800';
                
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    const slug = cat.name.toLowerCase().replace(/ /g, '-');
                    navigate(`/category/${slug}`, { state: { categoryName: cat.name } });
                  }}
                  className="relative h-32 md:h-48 rounded-2xl md:rounded-[24px] overflow-hidden group shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 text-left w-full"
                >
                  <img src={bgImage} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                    <span className="text-white font-bold text-base md:text-xl drop-shadow-md">{cat.name}</span>
                    <span className="text-gray-200 text-[10px] md:text-xs mt-1 font-medium tracking-wide drop-shadow-sm">Explore fresh catch</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main id="marketplace-section" className="flex-1">
              {/* Default State: Top Picks */}
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Top Picks</h2>
                  <p className="text-gray-500 text-sm">Recommended for you</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {topPicks.map((product) => (
                    <ProductCard 
                      key={`top-${product.id}`}
                      product={product}
                      onCartAdd={() => setCartCount(prev => prev + 1)}
                      onFavoriteToggle={(e) => toggleFavorite(product.id, e)}
                      isFavorite={favorites.includes(product.id)}
                      onNavigate={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>
              </div>

              {/* Default State: Recommended */}
              <div className="mb-12">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Recommended</h2>
                  <p className="text-gray-500 text-sm">Fresh arrivals and popular choices</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {recommendedProducts.map((product) => (
                    <ProductCard 
                      key={`rec-${product.id}`}
                      product={product}
                      onCartAdd={() => setCartCount(prev => prev + 1)}
                      onFavoriteToggle={(e) => toggleFavorite(product.id, e)}
                      isFavorite={favorites.includes(product.id)}
                      onNavigate={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>
              </div>
        </main>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col p-8"
          >
             <div className="max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center mb-8 md:mb-12">
                   <h2 className="text-3xl font-serif text-brand-primary">Search Store</h2>
                   <button onClick={() => setShowSearch(false)} className="p-4 hover:bg-gray-100 rounded-full">
                      <X size={32} />
                   </button>
                </div>
                 <div className="flex items-center gap-4 border-b-2 border-brand-primary py-4 md:py-6 mb-8 md:mb-12">
                   <Search size={24} className="text-gray-300 md:size-32" />
                   <input 
                    type="text" 
                    autoFocus
                    placeholder="Search fresh fish..." 
                    className="w-full bg-transparent text-xl md:text-3xl font-sans outline-none placeholder:text-gray-200"
                   />
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                   <div>
                      <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">Popular Searches</h4>
                      <div className="flex flex-wrap gap-3">
                         {['Salmon Fillet', 'Tiger Prawns', 'Bluefin Sashimi', 'Oysters', 'Lobster Tails'].map(tag => (
                           <button key={tag} className="px-6 py-2 bg-gray-50 hover:bg-brand-secondary hover:text-white rounded-full text-sm font-bold transition-all border border-gray-100">
                             {tag}
                           </button>
                         ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">Recent Collections</h4>
                      <div className="space-y-4">
                         {['Norwegian Winter Specials', 'Sustainable Shellfish Guide', 'Japanese Sashimi Grade Imports'].map(col => (
                           <div key={col} className="flex items-center gap-4 group cursor-pointer">
                              <div className="w-12 h-12 bg-gray-100 rounded-xl group-hover:bg-brand-primary transition-colors" />
                              <span className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{col}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif">Your Basket</h3>
                <button 
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cartCount === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                    <ShoppingBag size={64} strokeWidth={1} />
                    <p className="font-medium">Your basket is empty</p>
                    <button 
                      onClick={() => setShowCart(false)}
                      className="text-brand-primary underline underline-offset-4"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Simulated cart item */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={PRODUCTS[0].image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 leading-tight">Wild Atlantic Salmon</h4>
                        <p className="text-gray-400 text-xs mb-2">1.5 lbs</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">$37.48</span>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setCartCount(c => Math.max(0, c - 1))} className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-sm">-</button>
                            <span className="text-sm font-bold">1</span>
                            <button onClick={() => setCartCount(c => c + 1)} className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-sm">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-xl font-bold">${(cartCount * 25).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cartCount === 0}
                >
                  Checkout Now
                </button>
                <button 
                  onClick={() => setShowCart(false)}
                  className="w-full py-4 bg-white text-gray-400 text-sm font-medium hover:text-gray-600 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Features */}
      <section className="py-24 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Fish size={400} className="rotate-12 translate-x-20" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-12">
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20">
                <Truck size={28} className="text-brand-secondary md:size-32" />
              </div>
              <h4 className="text-xl md:text-2xl mb-3">Free Cold-Chain Delivery</h4>
              <p className="text-blue-100/60 leading-relaxed text-sm md:text-base">
                Temperature-controlled delivery within 24 hours of landing at our docks. 
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20">
                <ShieldCheck size={28} className="text-brand-secondary md:size-32" />
              </div>
              <h4 className="text-xl md:text-2xl mb-3">100% Quality Guaranteed</h4>
              <p className="text-blue-100/60 leading-relaxed text-sm md:text-base">
                If it's not the best seafood you've ever had, we'll refund you instantly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20">
                <MapPin size={28} className="text-brand-secondary md:size-32" />
              </div>
              <h4 className="text-xl md:text-2xl mb-3">Full Traceability</h4>
              <p className="text-blue-100/60 leading-relaxed text-sm md:text-base">
                Scan the QR code to see exactly where and when your seafood was caught.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-full max-w-[280px] bg-white shadow-2xl z-[110] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 w-auto" />
                  <span className="text-xl font-bold text-brand-primary">Kadal 2 Kadaai</span>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-lg font-bold text-gray-900">
                <button 
                  onClick={() => { setShowMobileMenu(false); scrollToProducts(); }} 
                  className="flex items-center justify-between group hover:text-brand-primary transition-colors text-left"
                >
                  Marketplace <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-primary" />
                </button>
                <button 
                  onClick={() => navigate('/sustainability')} 
                  className="flex items-center justify-between group hover:text-brand-primary transition-colors text-left"
                >
                  Sustainability <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-primary" />
                </button>
                <button 
                  onClick={() => navigate('/recipes')} 
                  className="flex items-center justify-between group hover:text-brand-primary transition-colors text-left"
                >
                  Recipes <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-primary" />
                </button>
                <button 
                  onClick={() => navigate('/b2b')} 
                  className="flex items-center justify-between group hover:text-brand-primary transition-colors text-left"
                >
                  Wholesale <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-primary" />
                </button>
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 space-y-4">
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Connect With Us</p>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">In</div>
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">Fb</div>
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">Ig</div>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 w-auto" />
              <span className="text-2xl font-bold text-brand-primary">Kadal 2 Kadaai</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
              Revolutionizing the seafood industry through transparency, logistics, 
              and direct-to-consumer sustainability.
            </p>
            <div className="flex gap-4">
              <div 
                onClick={() => showToast("Opening LinkedIn Profile...", "info")}
                className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
              >
                <span className="text-sm font-bold">In</span>
              </div>
              <div 
                onClick={() => showToast("Follow us on Facebook", "info")}
                className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
              >
                <span className="text-sm font-bold">Fb</span>
              </div>
              <div 
                onClick={() => showToast("Follow us on Instagram", "info")}
                className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
              >
                <span className="text-sm font-bold">Ig</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-gray-900 font-bold mb-6">Marketplace</h5>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><button onClick={scrollToProducts} className="hover:text-brand-primary">All Products</button></li>
              <li><button onClick={scrollToProducts} className="hover:text-brand-primary">New Arrivals</button></li>
              <li><button onClick={scrollToProducts} className="hover:text-brand-primary">Best Sellers</button></li>
              <li><button onClick={() => navigate('/checkout')} className="hover:text-brand-primary">Gift Cards</button></li>
              <li><button onClick={() => navigate('/checkout')} className="hover:text-brand-primary">Subscription Box</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-gray-900 font-bold mb-6">Company</h5>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><button onClick={() => navigate('/sustainability')} className="hover:text-brand-primary">Our Story</button></li>
              <li><button onClick={() => navigate('/sustainability')} className="hover:text-brand-primary">Sustainability</button></li>
              <li><button onClick={() => navigate('/b2b')} className="hover:text-brand-primary">Partner With Us</button></li>
              <li><button onClick={() => navigate('/recipes')} className="hover:text-brand-primary">Chef's Blog</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-brand-primary">Contact Support</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-8 gap-4">
          <p className="text-gray-400 text-xs text-center md:text-left">
            &copy; 2024 Kadal 2 Kadaai. All fish ethically sourced.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

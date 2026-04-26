import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronDown,
  Info,
  Waves,
  MessageSquare,
  ArrowRight,
  Plus,
  Check,
  ChevronLeft,
  Quote,
  CheckCircle2,
  Trash2,
  Utensils,
  Leaf,
  Scale,
  Scissors,
  Truck,
  Droplets,
  ThermometerSnowflake,
  Sparkles,
  Boxes,
  Refrigerator,
  IceCream,
  HandHeart,
  User,
  Package
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../components/Toast';
import { useStore } from '../lib/store';

const WEIGHT_OPTIONS = ['1kg', '2kg', '5kg'];
const CUT_OPTIONS = ['Curry Cut', 'Fry Cut', 'Fillet', 'Whole'];

const REVIEWS = [
  { id: 1, user: 'Chef Marco S.', rating: 5, comment: 'Absolutely stunning quality. The marbling on the salmon is consistent throughout. Best I have found in the city.', date: 'Oct 12, 2024' },
  { id: 2, user: 'Elena P.', rating: 5, comment: 'Super fresh and delivered in perfectly cold packaging. Will definitely be a regular customer.', date: 'Nov 02, 2024' },
  { id: 3, user: 'Jordan T.', rating: 4, comment: 'Great service. The prawns were massive as advertised. Slightly pricey but worth it for the quality.', date: 'Oct 28, 2024' },
];

export default function ProductDetail() {
  const { products: ALL_PRODUCTS } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [selectedCut, setSelectedCut] = useState('Curry Cut');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [orderMode, setOrderMode] = useState<'retail' | 'bulk'>('retail');
  const [bulkQty, setBulkQty] = useState(50);
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'source' | 'prep'>('about');
  const { showToast } = useToast();
  
  const product = ALL_PRODUCTS.find(p => p.id === parseInt(id || '1')) || ALL_PRODUCTS[0];
  const similarProducts = ALL_PRODUCTS.filter(p => p.id !== product.id && p.isVisibleConsumer).slice(0, 6);

  // Gallery images (exactly 3 views as requested)
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
  ];

  const { cart, addToCart } = useStore();
  
  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedWeight}-${selectedCut}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      weight: selectedWeight,
      cut: selectedCut,
      quantity: quantity,
      unit: product.unit
    });
    showToast(`${product.name} (${selectedWeight}, ${selectedCut}) added to cart!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] font-sans text-[#1A2E44] selection:bg-brand-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/consumer')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </button>
          
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tight text-brand-primary">Kadal 2 Kadaai</span>
          </div>

          <div className="flex items-center gap-4">
            <div 
              className="relative cursor-pointer group"
              onClick={() => navigate('/orders')}
              title="My Orders"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                <Package size={18} />
              </div>
            </div>

            <div 
              className="relative cursor-pointer group"
              onClick={() => navigate('/profile')}
              title="My Profile"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                <User size={18} />
              </div>
            </div>

            <div 
              className="relative cursor-pointer group"
              onClick={() => navigate('/cart')}
              title="Shopping Cart"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                <ShoppingBag size={18} />
              </div>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-12 pb-12 max-w-7xl mx-auto px-6">
        {/* Above the Fold Section */}
        <div className="grid lg:grid-cols-12 gap-12 mb-10">
          {/* Left Side: Product Image Gallery (60%) */}
          <div className="lg:col-span-7 pt-4">
            <div className="flex flex-col gap-6">
              <div className="relative group cursor-zoom-in">
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden bg-white shadow-xl shadow-blue-900/5 border border-blue-50">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.15 }}
                    transition={{ 
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.4, ease: "easeOut" }
                    }}
                    src={galleryImages[activeImage]} 
                    className="w-full h-full object-cover origin-center"
                    alt={product.name}
                  />
                </div>
                <div className="absolute top-8 left-8 pointer-events-none">
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                    <Sparkles size={14} />
                    Fresh Catch Today
                  </span>
                </div>
              </div>

              {/* Thumbnails below the main image as requested */}
              <div className="flex gap-4 justify-center">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                      activeImage === idx ? "border-brand-primary shadow-lg shadow-brand-primary/10" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Product Info & Buying Section (40%) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-secondary text-[10px] font-black uppercase tracking-widest">
                  <MapPin size={14} />
                  Sourced from {product.origin}
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  In Stock
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-[#0F1C2E] leading-tight tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-orange-400">
                  <Star size={18} fill="currentColor" />
                  <span className="text-base font-black text-[#1A2E44]">{product.rating}</span>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.reviews} verified reviews</span>
              </div>
            </div>

            <div className="flex bg-blue-50/50 p-1 rounded-2xl mb-2 border border-blue-100">
              <button onClick={() => setOrderMode('retail')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all", orderMode === 'retail' ? "bg-white shadow-sm text-brand-primary" : "text-gray-400 hover:text-gray-900")}>Retail / Home</button>
              <button onClick={() => setOrderMode('bulk')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2", orderMode === 'bulk' ? "bg-brand-primary shadow-sm text-white" : "text-gray-400 hover:text-gray-900")}>
                <Boxes size={16} /> Bulk / B2B
              </button>
            </div>

            <div className="p-8 bg-white rounded-[40px] border border-blue-50 shadow-xl shadow-blue-900/5 space-y-8">
              {orderMode === 'retail' ? (
                <>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-brand-primary tracking-tighter">₹{product.price}</span>
                        <span className="text-lg font-bold text-gray-400">/ kg</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Speed</p>
                      <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-tight">
                        <Truck size={18} />
                        <span>Express Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Weight Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Weight</p>
                      <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded">Popular Choice</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {WEIGHT_OPTIONS.map(weight => (
                        <button
                          key={weight}
                          onClick={() => setSelectedWeight(weight)}
                          className={cn(
                            "py-4 rounded-2xl border-2 text-sm font-black transition-all",
                            selectedWeight === weight 
                              ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                              : "bg-white border-blue-50 text-gray-500 hover:border-brand-primary/30"
                          )}
                        >
                          {weight}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cut Selection */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Choose Your Cut</p>
                    <div className="grid grid-cols-2 gap-3">
                      {CUT_OPTIONS.map(cut => (
                        <button
                          key={cut}
                          onClick={() => setSelectedCut(cut)}
                          className={cn(
                            "py-4 px-5 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-between",
                            selectedCut === cut 
                              ? "bg-blue-50 border-brand-primary text-brand-primary" 
                              : "bg-white border-blue-50 text-gray-500 hover:border-brand-primary/30"
                          )}
                        >
                          {cut}
                          {selectedCut === cut && <Check size={16} className="text-brand-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-6 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                        <button 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center font-black text-gray-400 hover:text-brand-primary transition-all text-xl"
                        >
                          -
                        </button>
                        <span className="text-xl font-black w-6 text-center">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center font-black text-gray-400 hover:text-brand-primary transition-all text-xl"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-brand-primary text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/25 active:scale-95 py-5"
                      >
                        <ShoppingBag size={20} />
                        Add to Cart
                      </button>
                    </div>
                    <button 
                      className="w-full bg-white border-2 border-[#0F1C2E] text-[#0F1C2E] rounded-[24px] font-black text-sm uppercase tracking-widest py-5 hover:bg-[#0F1C2E] hover:text-white transition-all active:scale-95"
                    >
                      Buy Now
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Freshness guaranteed • Secure Checkout</span>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Supplier & Grading */}
                  <div className="flex items-center justify-between border-b border-blue-50 pb-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Supplier</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">Coastal Fisheries Co.</span>
                        <div className="flex items-center gap-1 text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded text-xs font-bold">
                          <Star size={10} fill="currentColor" /> 4.9
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Size Grading</p>
                      <span className="font-bold text-sm text-gray-900">800g - 1.2kg / piece</span>
                    </div>
                  </div>

                  {/* Tiered Pricing */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bulk Pricing Tiers (per kg)</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border border-blue-100 bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs font-bold text-gray-500 mb-1">10kg - 49kg</p>
                        <p className="text-lg font-black text-brand-primary">₹{(product.price * 0.95).toFixed(0)}</p>
                        <p className="text-[10px] text-emerald-600 font-bold">5% Off</p>
                      </div>
                      <div className="border border-blue-100 bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs font-bold text-gray-500 mb-1">50kg - 99kg</p>
                        <p className="text-lg font-black text-brand-primary">₹{(product.price * 0.90).toFixed(0)}</p>
                        <p className="text-[10px] text-emerald-600 font-bold">10% Off</p>
                      </div>
                      <div className="border border-brand-primary bg-blue-50 rounded-xl p-3 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-brand-secondary text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Best Value</div>
                        <p className="text-xs font-bold text-brand-primary mb-1">100kg+</p>
                        <p className="text-lg font-black text-brand-primary">₹{(product.price * 0.85).toFixed(0)}</p>
                        <p className="text-[10px] text-emerald-600 font-bold">15% Off</p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & CTA */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Enter Quantity (kg)</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 w-1/3">
                        <button onClick={() => setBulkQty(q => Math.max(10, q - 10))} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center font-bold text-gray-400 hover:text-brand-primary transition-all">-</button>
                        <input type="number" value={bulkQty} onChange={(e) => setBulkQty(Number(e.target.value))} className="w-full bg-transparent text-center font-bold outline-none" />
                        <button onClick={() => setBulkQty(q => q + 10)} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center font-bold text-gray-400 hover:text-brand-primary transition-all">+</button>
                      </div>
                      <button onClick={() => showToast(`Added ${bulkQty}kg to B2B Order`, 'success')} className="flex-1 bg-brand-secondary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ff8f5c] transition-all shadow-lg active:scale-95">
                        <Boxes size={20} /> Buy in Bulk
                      </button>
                    </div>
                  </div>

                  {/* Logistics Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-blue-50">
                    <div className="flex items-center gap-2">
                      <ThermometerSnowflake size={16} className="text-blue-500" />
                      <span className="text-xs font-bold text-gray-600">Cold Chain (0-4°C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-600">Same-Day Dispatch</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" />
              100% Quality Guaranteed
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Droplets size={14} className="text-blue-500" />
              Expertly Cleaned
            </div>
          </div>

          {/* Pricing Clarity Section */}
          <div className="p-5 bg-blue-50/30 rounded-3xl border border-blue-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing Transparency</span>
              <div className="flex items-center gap-1.5 text-brand-primary">
                <Info size={12} />
                <span className="text-[10px] font-bold">Pricing Guide</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Standard Rate</span>
                <span className="font-bold text-gray-900">₹{product.price} / kg</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Bulk Savings</span>
                <span className="font-bold text-emerald-600">Up to 15% Off</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic leading-snug pt-1 border-t border-blue-50/50">
              * Final bill amount may vary slightly based on the exact weight of the fish catch.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-blue-50 mb-12" />

      {/* Key Highlights Section */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {[
            { icon: <Sparkles size={18} />, label: "Freshness", value: "Fresh Catch", color: "bg-emerald-50 text-emerald-600" },
            { icon: <Waves size={18} />, label: "Source", value: product.origin || "Coastal Sea", color: "bg-blue-50 text-blue-600" },
            { icon: <Scissors size={18} />, label: "Cut Type", value: "Steaks/Curry", color: "bg-orange-50 text-orange-600" },
            { icon: <Scale size={18} />, label: "Weight", value: "500g - 5kg", color: "bg-purple-50 text-purple-600" },
            { icon: <Clock size={18} />, label: "Delivery", value: "Within 6 Hrs", color: "bg-brand-primary/10 text-brand-primary" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-[32px] border border-blue-50 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", item.color)}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-xs font-black text-[#0F1C2E]">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full h-px bg-blue-50 mb-12" />

      {/* Product Specifications Section */}
      <section className="mb-12">
        <div className="bg-white rounded-[40px] border border-blue-50 shadow-sm p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <h3 className="text-2xl font-black text-[#0F1C2E] mb-10 flex items-center gap-4">
            <div className="w-1.5 h-8 bg-brand-primary rounded-full" />
            Product Specifications
          </h3>
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-2">
            {[
              { label: "Species Name", value: product.name },
              { label: "Origin Location", value: product.origin || "Coastal Waters" },
              { label: "Storage Type", value: "Fresh / Chilled (0-4°C)" },
              { label: "Shelf Life", value: "Best within 48 Hours" },
              { label: "Cut Type", value: "Steaks, Curry, Whole" },
              { label: "Weight Range", value: "500g - 5kg Per Fish" },
              { label: "Packaging Type", value: "Vacuum Sealed / Chilled Tray" }
            ].map((spec, i) => (
              <div key={i} className="flex items-center justify-between py-5 border-b border-blue-50 last:border-0 md:[&:nth-last-child(2)]:border-0">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</span>
                <span className="text-sm font-black text-[#0F1C2E]">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-blue-50 mb-12" />

      {/* Storage & Freshness Section */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#F0F7FF] p-10 rounded-[40px] border border-blue-100 relative overflow-hidden">
            <ThermometerSnowflake size={120} className="absolute -bottom-10 -right-10 text-blue-200/30 rotate-12" />
            <h3 className="text-2xl font-black text-[#0F1C2E] mb-8">Storage Guide</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Shelf Life</p>
                  <p className="text-sm font-bold text-[#0F1C2E]">2–3 Days (Refrigerated) | 3 Months (Frozen)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <Refrigerator size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Refrigerate</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Keep at 0-4°C in the coldest part of your fridge.</p>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <IceCream size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Freeze</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Store at -18°C or below for long-term storage.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-orange-50 p-10 rounded-[40px] border border-orange-100 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                  <HandHeart size={20} />
                </div>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Handling Tip</p>
              </div>
              <p className="text-xl font-bold text-orange-900 leading-tight">
                "Store immediately upon delivery to maintain peak texture and flavor."
              </p>
            </div>

            <div className="bg-emerald-50 p-10 rounded-[40px] border border-emerald-100 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <Waves size={20} />
                </div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Freshness Assurance</p>
              </div>
              <p className="text-xl font-bold text-emerald-900 leading-tight">
                Maintained in a strict cold chain from the coastal source to your delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-blue-50 mb-12" />

      {/* Enhanced Informational Tabs Section */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12 bg-white/50 p-2 rounded-[32px] border border-blue-50 w-fit mx-auto">
          {[
            { id: 'about', label: 'About This Fish', icon: <Utensils size={18} /> },
            { id: 'source', label: 'Source & Freshness', icon: <Waves size={18} /> },
            { id: 'prep', label: 'Cleaning & Preparation', icon: <Scissors size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveInfoTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-3xl text-sm font-black uppercase tracking-widest transition-all",
                activeInfoTab === tab.id 
                  ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20" 
                  : "bg-transparent text-gray-400 hover:text-gray-900"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[48px] border border-blue-50 shadow-xl shadow-blue-900/5 p-10 md:p-16 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/30 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {activeInfoTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-16"
              >
                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-[#0F1C2E]">About the Product</h3>
                    <p className="text-gray-500 leading-relaxed">
                      Known as the "King of Fish," {product.name} is prized for its exquisite flavor and firm, meaty texture. It's a versatile choice that remains moist even after high-heat cooking.
                    </p>
                    <ul className="space-y-3">
                      {['Firm & Flaky Texture', 'Rich in Omega-3 Fatty Acids', 'Mildly Sweet Flavor Profile'].map((point, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                          <CheckCircle2 size={16} className="text-brand-primary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-[#0F1C2E]">Source & Quality</h3>
                    <p className="text-gray-500 leading-relaxed">
                      Sourced directly from the coastal waters of {product.origin || 'the Bay of Bengal'}, we ensure that every catch is handled with extreme care from the boat to our processing center.
                    </p>
                    <ul className="space-y-3">
                      {['Daily Coastal Sourcing', '25-Point Quality Check', '100% Traceability'].map((point, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-10 rounded-[40px] border border-blue-100">
                  <h3 className="text-2xl font-black text-[#0F1C2E] mb-6">Why Choose This?</h3>
                  <div className="grid sm:grid-cols-3 gap-8">
                    {[
                      { title: 'Always Fresh', desc: 'Never chemically preserved; only chilled to maintain integrity.' },
                      { title: 'Expertly Cut', desc: 'Hand-cut by master butchers for perfect culinary results.' },
                      { title: 'Safe Delivery', desc: 'Maintained in a strict cold chain to your doorstep.' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <h4 className="font-black text-brand-primary text-sm uppercase tracking-wider">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeInfoTab === 'source' && (
              <motion.div
                key="source"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-3 gap-12"
              >
                {[
                  { icon: <MapPin className="text-brand-secondary" />, title: "Coastal Source", desc: `${product.origin} Coastal Waters - Directly from the boat to our facility.` },
                  { icon: <Clock className="text-brand-secondary" />, title: "Catch Timeline", desc: "Harvested less than 12 hours ago ensuring maximum nutrient retention." },
                  { icon: <Truck className="text-brand-secondary" />, title: "Transit", desc: "Maintained at 0-4°C in temperature-controlled vans throughout the journey." }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold text-[#0F1C2E]">{item.title}</h4>
                    <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeInfoTab === 'prep' && (
              <motion.div
                key="prep"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-[#0F1C2E] tracking-tight">Cleaning Standards</h3>
                    <ul className="space-y-4">
                      {[
                        "Cleaned with Purified RO Water",
                        "Hand-processed in a temperature-controlled environment",
                        "Strict hygiene protocols (Gloves & Hairnets worn)",
                        "Zero preservatives or chemicals added"
                      ].map((tip, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-500 font-medium">
                          <CheckCircle2 size={18} className="text-emerald-500" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50/50 p-8 rounded-[32px] border border-emerald-100/50">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Preparation Tip</p>
                    <p className="text-emerald-900 font-bold leading-relaxed italic">
                      "Always thaw under refrigeration for 12 hours if bought frozen. For fresh catch, a simple rinse with cold water is sufficient before marinating."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Trust & Quality Indicators */}
      <section className="mb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <ShieldCheck size={28} className="text-emerald-500" />, 
              title: "Hygienic Processing", 
              desc: "Processed in ISO-certified, temperature-controlled facilities with RO water cleaning.",
              bg: "bg-emerald-50/50",
              border: "border-emerald-100/50"
            },
            { 
              icon: <ThermometerSnowflake size={28} className="text-blue-500" />, 
              title: "Cold Chain Maintained", 
              desc: "From the coast to your kitchen, we maintain a strict 0-4°C environment at every step.",
              bg: "bg-blue-50/50",
              border: "border-blue-100/50"
            },
            { 
              icon: <CheckCircle2 size={28} className="text-brand-secondary" />, 
              title: "Verified Suppliers", 
              desc: "We only partner with sustainable coastal fisheries that meet our 25-point quality check.",
              bg: "bg-orange-50/50",
              border: "border-orange-100/50"
            }
          ].map((trust, i) => (
            <div key={i} className={cn("p-8 rounded-[40px] border transition-all hover:shadow-lg", trust.bg, trust.border)}>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                {trust.icon}
              </div>
              <h4 className="text-xl font-black text-[#0F1C2E] mb-3">{trust.title}</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{trust.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us & Storage Tips */}
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-brand-primary p-10 rounded-[40px] text-white relative overflow-hidden">
            <Waves className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64" />
            <h3 className="text-2xl font-bold mb-8 relative z-10">Why Choose Kadal 2 Kadaai?</h3>
            <div className="grid sm:grid-cols-2 gap-8 relative z-10">
              {[
                { title: 'Direct from Source', desc: 'Eliminating middlemen to ensure the freshest catch reach your kitchen.' },
                { title: 'Triple Quality Check', desc: 'Every item is inspected for color, texture, and aroma before dispatch.' },
                { title: 'Cold Chain Mastery', desc: 'Maintained at 0-4°C from the coast to your doorstep.' },
                { title: 'Ethical Sourcing', desc: 'Supporting local fishing communities and sustainable practices.' }
              ].map((point, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-orange-400" />
                    <h4 className="font-bold text-sm">{point.title}</h4>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#EBF3FF] p-10 rounded-[40px] border border-blue-100 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
                <ThermometerSnowflake size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Storage & Handling Instructions</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Commercial Cold Chain Best Practices</p>
              </div>
            </div>
            <ul className="space-y-4">
              {[
                'Immediately transfer to walk-in freezer (-18°C) or chiller (0-2°C) upon arrival.',
                'Maintain strict FIFO (First In, First Out) inventory rotation.',
                'Do not break the cold chain; ensure prep areas are temperature controlled.',
                'Thaw under refrigeration, never at room temperature or warm water.'
              ].map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-brand-primary border border-blue-100">
                    {idx + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

      {/* Related Products / Cross-Sell */}
      <section className="pt-20 border-t border-blue-50">
        <div className="mb-12">
          <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-3">Recommendations</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-[#0F1C2E] tracking-tight">Similar Products</h2>
            <button 
              onClick={() => navigate('/consumer')}
              className="text-sm font-bold text-brand-primary hover:gap-3 transition-all flex items-center gap-2 group"
            >
              Explore Full Marketplace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {similarProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/product/${p.id}`)}
                className="group bg-white rounded-3xl overflow-hidden border border-blue-50 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-primary">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-sm text-[#1A2E44] mb-2 line-clamp-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-primary">₹{p.price}</span>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-bold text-[#1A2E44]">{p.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Reviews Section - Optional but added for completeness */}
      <section className="bg-white border-t border-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Customer Stories</h2>
            <p className="text-gray-500">Real feedback from our seafood lovers across the city.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-[#F8FBFF] p-8 rounded-[32px] border border-blue-50 relative">
                <Quote size={40} className="text-blue-100 absolute top-6 right-8" />
                <div className="flex items-center gap-1 text-orange-400 mb-6">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-8 relative z-10 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center justify-between pt-6 border-t border-blue-100/50">
                  <span className="font-bold text-sm">{review.user}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer / CTA */}
      <footer className="bg-[#0F1C2E] py-12 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Waves size={24} className="text-brand-secondary" />
            <span className="text-xl font-bold tracking-tight">Kadal 2 Kadaai</span>
          </div>
          <p className="text-gray-400 text-sm">© 2024 Kadal 2 Kadaai Seafood Marketplace. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

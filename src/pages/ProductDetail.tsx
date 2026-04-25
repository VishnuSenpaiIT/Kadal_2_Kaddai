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
  Boxes
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../components/Toast';
import { useStore } from '../lib/store';

const WEIGHT_OPTIONS = ['250g', '500g', '1kg'];
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
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [selectedCut, setSelectedCut] = useState('Curry Cut');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [orderMode, setOrderMode] = useState<'retail' | 'bulk'>('bulk');
  const [bulkQty, setBulkQty] = useState(50);
  const { showToast } = useToast();
  
  const product = ALL_PRODUCTS.find(p => p.id === parseInt(id || '1')) || ALL_PRODUCTS[0];
  const similarProducts = ALL_PRODUCTS.filter(p => p.id !== product.id && p.isVisibleConsumer).slice(0, 4);

  // Gallery images (mocking multiple views)
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
  ];

  const handleAddToCart = () => {
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
            <div className="relative cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                <ShoppingBag size={20} />
              </div>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">2</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        {/* Above the Fold Section */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7">
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                      activeImage === idx ? "border-brand-primary" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                  </button>
                ))}
              </div>
              <div className="flex-1 relative">
                <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-white shadow-sm border border-blue-50">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={galleryImages[activeImage]} 
                    className="w-full h-full object-cover"
                    alt={product.name}
                  />
                </div>
                <div className="absolute top-6 left-6">
                  <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Fresh Catch Today
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Essential Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2 text-brand-secondary text-xs font-bold uppercase tracking-widest">
                <MapPin size={14} />
                Sourced from {product.origin}
              </div>
              <h1 className="text-4xl font-bold text-[#0F1C2E] mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-orange-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold text-[#1A2E44]">{product.rating}</span>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{product.reviews} verified reviews</span>
              </div>
            </div>

            <div className="flex bg-blue-50/50 p-1 rounded-2xl mb-2 border border-blue-100">
              <button onClick={() => setOrderMode('retail')} className={cn("flex-1 py-2.5 text-sm font-bold rounded-xl transition-all", orderMode === 'retail' ? "bg-white shadow-sm text-brand-primary" : "text-gray-500 hover:text-gray-900")}>Retail / Home</button>
              <button onClick={() => setOrderMode('bulk')} className={cn("flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2", orderMode === 'bulk' ? "bg-brand-primary shadow-sm text-white" : "text-gray-500 hover:text-gray-900")}>
                <Boxes size={16} /> Bulk / B2B
              </button>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-blue-50 shadow-sm space-y-6">
              {orderMode === 'retail' ? (
                <>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price per kg</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-brand-primary">₹{product.price}</span>
                        <span className="text-sm text-gray-400">/ kg</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <Truck size={16} />
                        <span>Today, 6PM - 9PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Weight Selection */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Select Weight</p>
                    <div className="grid grid-cols-3 gap-3">
                      {WEIGHT_OPTIONS.map(weight => (
                        <button
                          key={weight}
                          onClick={() => setSelectedWeight(weight)}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-bold transition-all",
                            selectedWeight === weight 
                              ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20" 
                              : "bg-white border-blue-100 text-gray-500 hover:border-brand-primary/30"
                          )}
                        >
                          {weight}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cut Selection */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Choose Your Cut</p>
                    <div className="grid grid-cols-2 gap-3">
                      {CUT_OPTIONS.map(cut => (
                        <button
                          key={cut}
                          onClick={() => setSelectedCut(cut)}
                          className={cn(
                            "py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between",
                            selectedCut === cut 
                              ? "bg-blue-50 border-brand-primary text-brand-primary" 
                              : "bg-white border-blue-100 text-gray-500 hover:border-brand-primary/30"
                          )}
                        >
                          {cut}
                          {selectedCut === cut && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center font-bold text-gray-400 hover:text-brand-primary transition-all"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold w-4 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center font-bold text-gray-400 hover:text-brand-primary transition-all"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/25 active:scale-95"
                    >
                      <Plus size={20} />
                      Add to Cart
                    </button>
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
          </div>
        </div>

        {/* Informational Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* About This Fish */}
          <div className="bg-white p-8 rounded-[32px] border border-blue-50 shadow-sm space-y-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-primary">
              <Utensils size={24} />
            </div>
            <h3 className="text-xl font-bold">About This Fish</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taste Profile</p>
                <p className="text-sm text-gray-600 leading-relaxed">Mild, sweet flavor with a rich buttery undertone that pairs perfectly with citrus.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Texture</p>
                <p className="text-sm text-gray-600 leading-relaxed">Firm yet tender flakes, holding its shape beautifully during various cooking methods.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Best Cooking Style</p>
                <p className="text-sm text-gray-600 leading-relaxed">Pan-searing, grilling, or light steaming to preserve the delicate natural juices.</p>
              </div>
            </div>
          </div>

          {/* Source & Freshness */}
          <div className="bg-white p-8 rounded-[32px] border border-blue-50 shadow-sm space-y-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Waves size={24} />
            </div>
            <h3 className="text-xl font-bold">Source & Freshness</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-secondary mt-0.5" />
                <div>
                  <p className="text-xs font-bold mb-0.5">Coastal Source</p>
                  <p className="text-sm text-gray-500">{product.origin} Coastal Waters</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-brand-secondary mt-0.5" />
                <div>
                  <p className="text-xs font-bold mb-0.5">Catch Time</p>
                  <p className="text-sm text-gray-500">Less than 12 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-brand-secondary mt-0.5" />
                <div>
                  <p className="text-xs font-bold mb-0.5">Delivery Timeline</p>
                  <p className="text-sm text-gray-500">Same-day delivery in temperature-controlled vans</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cleaning & Preparation */}
          <div className="bg-white p-8 rounded-[32px] border border-blue-50 shadow-sm space-y-6">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
              <Scissors size={24} />
            </div>
            <h3 className="text-xl font-bold">Cleaning & Preparation</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                <ShieldCheck size={20} className="text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Hygienic Process</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                <Leaf size={20} className="text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">No Preservatives Added</span>
              </div>
              <p className="text-xs text-gray-400 italic leading-relaxed">
                * All our fish is cleaned with purified RO water and handled in a temperature-controlled environment to maintain peak freshness.
              </p>
            </div>
          </div>
        </div>

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

        {/* Related Products */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#0F1C2E]">You Might Also Like</h2>
            <button 
              onClick={() => navigate('/consumer')}
              className="text-sm font-bold text-brand-primary hover:gap-2 transition-all flex items-center gap-1 group"
            >
              View More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

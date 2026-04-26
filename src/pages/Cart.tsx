import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';
import { useToast } from '../components/Toast';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();
  const { showToast } = useToast();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const calculateWeight = (weightStr: string) => {
    const num = parseFloat(weightStr);
    if (weightStr.toLowerCase().includes('kg')) return num;
    if (weightStr.toLowerCase().includes('g')) return num / 1000;
    return num;
  };

  const totalWeight = cart.reduce((acc, item) => acc + (calculateWeight(item.weight) * item.quantity), 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = 0; // Placeholder for promo codes
  const shippingFee = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + shippingFee;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire bag?')) {
      clearCart();
      showToast('Your bag has been cleared', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] font-sans text-[#1A2E44] selection:bg-brand-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/consumer')}
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-brand-primary transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </button>
          
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 w-auto" />
            <span className="text-xl font-black tracking-tight text-brand-primary uppercase">Kadal 2 Kadaai</span>
          </div>

          <div className="w-24 md:w-32" /> {/* Spacer */}
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F1C2E] mb-4">Your Shopping Bag</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <ShoppingBag size={14} className="text-brand-primary" />
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Selected • {totalWeight.toFixed(2)}kg Total Weight
            </p>
          </div>
          
          {cart.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="text-xs font-black text-red-400 hover:text-red-500 uppercase tracking-[0.2em] flex items-center gap-2 transition-colors py-2 group"
            >
              <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
              Clear Entire Bag
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 bg-white rounded-[48px] border border-blue-50 shadow-xl shadow-blue-900/5 text-center"
            >
              <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center text-brand-primary mb-8 animate-bounce">
                <ShoppingBag size={64} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-black text-[#0F1C2E] mb-4">Your bag is empty</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                Looks like you haven't added any fresh catch to your bag yet. Browse our selection and find something delicious!
              </p>
              <button 
                onClick={() => navigate('/consumer')}
                className="bg-brand-primary text-white px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/25 active:scale-95 flex items-center gap-3"
              >
                Browse Fresh Products
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-12 gap-12 items-start"
            >
              {/* Left Column: Cart Items */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white rounded-[40px] border border-blue-50 shadow-sm overflow-hidden">
                  {cart.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-6 flex flex-col md:flex-row gap-6 group hover:bg-blue-50/20 transition-all",
                        idx !== cart.length - 1 && "border-b border-gray-50"
                      )}
                    >
                      <div className="w-full md:w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <img src={item.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-black text-[#0F1C2E] mb-1">{item.name}</h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">{item.weight}</span>
                              <span className="bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">{item.cut}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              removeFromCart(item.id);
                              showToast('Item removed from cart', 'info');
                            }}
                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center gap-5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center font-black text-gray-400 hover:text-brand-primary transition-all shadow-sm shadow-transparent hover:shadow-gray-200"
                            >
                              <Minus size={14} />
                            </motion.button>
                            
                            <motion.span 
                              key={item.quantity}
                              initial={{ scale: 1.2, color: '#0066FF' }}
                              animate={{ scale: 1, color: '#0F1C2E' }}
                              className="text-base font-black w-5 text-center"
                            >
                              {item.quantity}
                            </motion.span>
                            
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center font-black text-gray-400 hover:text-brand-primary transition-all shadow-sm shadow-transparent hover:shadow-gray-200"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>
                          
                          <div className="text-right">
                            <motion.p 
                              key={item.price * item.quantity}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xl font-black text-[#0F1C2E]"
                            >
                              ₹{item.price * item.quantity}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: Summary Panel */}
              <div className="lg:col-span-4 sticky top-32">
                <div className="bg-white p-8 rounded-[40px] border border-blue-50 shadow-xl shadow-blue-900/5 space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-[#0F1C2E] mb-2">Order Summary</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Finalize your selection</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-widest">Selected Items</span>
                      <span className="font-black text-[#0F1C2E]">{totalItems} Units</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-widest">Net Weight</span>
                      <span className="font-black text-[#0F1C2E]">{totalWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-widest">Base Subtotal</span>
                      <span className="font-black text-[#0F1C2E]">₹{subtotal}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-500 font-bold uppercase tracking-widest">Discount</span>
                        <span className="font-black text-emerald-500">-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-widest">Delivery Fee</span>
                      {shippingFee === 0 ? (
                        <span className="font-black text-emerald-600 uppercase tracking-widest text-[10px] bg-emerald-50 px-2 py-1 rounded">Free</span>
                      ) : (
                        <span className="font-black text-[#0F1C2E]">₹{shippingFee}</span>
                      )}
                    </div>
                    
                    {shippingFee > 0 && (
                      <div className="bg-blue-50/50 p-3 rounded-2xl">
                        <p className="text-[9px] text-brand-primary font-black uppercase tracking-widest leading-tight">
                          Add ₹{500 - subtotal} more to qualify for FREE cold-chain delivery!
                        </p>
                      </div>
                    )}

                    <div className="h-px bg-gray-50 w-full" />
                    
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-base font-black text-[#0F1C2E] block">Total Payable</span>
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">(All inclusive)</span>
                      </div>
                      <motion.span 
                        key={total}
                        initial={{ scale: 1.1, color: '#FF7A00' }}
                        animate={{ scale: 1, color: '#0066FF' }}
                        className="text-4xl font-black text-brand-primary tracking-tight"
                      >
                        ₹{total}
                      </motion.span>
                    </div>

                    <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest text-center pt-2 leading-relaxed">
                      * Final price adjusted based on exact weight <br/>
                      at the time of processing.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <button 
                      onClick={handleCheckout}
                      className="w-full bg-brand-primary text-white rounded-[24px] font-black text-sm uppercase tracking-widest py-5 hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/25 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                      <CreditCard size={20} className="group-hover:rotate-12 transition-transform" />
                      Proceed to Checkout
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest justify-center">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Secure Checkout Guarantee
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest justify-center">
                        <Truck size={14} className="text-blue-500" />
                        Temperature-Controlled Delivery
                      </div>
                    </div>
                  </div>

                  {/* Promo Code placeholder */}
                  <div className="pt-6 border-t border-blue-50">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="PROMO CODE" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary font-black text-[10px] uppercase tracking-widest hover:text-brand-secondary transition-colors px-2">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

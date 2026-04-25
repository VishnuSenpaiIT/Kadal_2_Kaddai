import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  RotateCcw, 
  MessageCircle, 
  Calendar, 
  TrendingDown,
  ShieldCheck,
  Search,
  ShoppingCart,
  Bell,
  User,
  ChevronDown,
  Boxes,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useStore } from '../lib/store';

const CUT_OPTIONS = ['Whole (As is)', 'Cleaned & Gutted', 'Fillet', 'Steak', 'Chef Preferred Cuts'];
const DELIVERY_SLOTS = ['Early Morning (5 AM - 7 AM)', 'Mid-Morning (8 AM - 10 AM)', 'Afternoon (1 PM - 3 PM)'];

// Sample B2B test data for Trust Section
const TESTIMONIALS = [
  { name: 'Chef Gordon', role: 'Head Chef, The Ocean Pearl', quote: 'The freshness and reliability are unmatched. We order 50kg daily.' },
  { name: 'Sarah L.', role: 'Procurement, Seaside Resorts', quote: 'Their bulk pricing and delivery speed completely streamlined our seafood sourcing.' }
];

const PAST_ORDERS = [
  { id: 'B2B-8829', date: 'Yesterday, 6:00 AM', items: '20kg Seer Fish, 10kg Prawns', total: 15400 },
  { id: 'B2B-8821', date: 'Mon, 6:00 AM', items: '15kg Seer Fish, 5kg Crab', total: 12200 },
];

export default function B2BDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { products } = useStore();
  
  // B2B specific state
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedCuts, setSelectedCuts] = useState<Record<string, string>>({});
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  
  // Update time simulation
  const [lastUpdated] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - 15);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const b2bProducts = products.filter(p => p.isVisibleB2B).map(p => {
    // Add some B2B specific mock badges
    const badges = [];
    if (p.stock > 100) badges.push({ text: 'Just Arrived', color: 'bg-emerald-100 text-emerald-800' });
    else if (p.stock < 20) badges.push({ text: 'Limited Stock', color: 'bg-red-100 text-red-800' });
    return { ...p, badges };
  });

  const handleQtyChange = (id: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, qty) }));
  };

  const getBulkPrice = (basePrice: number, qty: number) => {
    if (!qty) return basePrice;
    if (qty >= 50) return basePrice * 0.85; // 15% off for 50kg+
    if (qty >= 20) return basePrice * 0.90; // 10% off for 20kg+
    if (qty >= 10) return basePrice * 0.95; // 5% off for 10kg+
    return basePrice;
  };

  const calculateTotal = () => {
    let total = 0;
    b2bProducts.forEach(p => {
      const qty = quantities[p.id.toString()] || 0;
      total += getBulkPrice(p.price, qty) * qty;
    });
    return total;
  };

  const generateWhatsAppMessage = () => {
    let msg = "Hello, I'd like to place a B2B order:\n\n";
    b2bProducts.forEach(p => {
      const qty = quantities[p.id.toString()];
      if (qty && qty > 0) {
        const cut = selectedCuts[p.id.toString()] || CUT_OPTIONS[0];
        const slot = selectedSlots[p.id.toString()] || DELIVERY_SLOTS[0];
        msg += `- ${qty}kg ${p.name} (${cut}) | Delivery: ${slot}\n`;
      }
    });
    msg += `\nPlease confirm.`;
    return encodeURIComponent(msg);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Refined B2B Header */}
      <header className="bg-brand-primary text-white sticky top-0 z-50 shadow-xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 h-20 flex items-center gap-8">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0" 
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
               <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-7 w-auto" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-white uppercase">Kadal 2 Kadaai</span>
              <span className="text-[10px] font-black tracking-[0.2em] text-brand-secondary uppercase">B2B Portal</span>
            </div>
          </div>

          {/* Centered Search & Category Section */}
          <div className="hidden lg:flex flex-1 max-w-3xl items-center bg-white/10 border border-white/20 rounded-2xl p-1 transition-all focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-blue-900/40">
            <div className="flex items-center gap-2 px-4 border-r border-white/20">
              <Filter size={16} className="text-brand-secondary" />
              <select className="bg-transparent text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer pr-6 py-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTcgMTBsNSA1IDUtNSIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_center] focus:text-gray-900">
                <option className="text-gray-900">Fish Types</option>
                <option className="text-gray-900">Freshness</option>
                <option className="text-gray-900">Cut Type</option>
              </select>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search size={18} className="text-white/40 group-focus-within:text-brand-primary" />
              <input 
                type="text" 
                placeholder="Search fish, type, supplier..." 
                className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/40 focus:outline-none focus:text-gray-900"
              />
            </div>
          </div>

          {/* Action Icons Section */}
          <div className="flex items-center gap-4 md:gap-6 ml-auto">
            <div className="hidden xl:flex flex-col items-end mr-4">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Market Status</span>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Live Stock • Updated {lastUpdated}
              </div>
            </div>

            <button 
              onClick={() => showToast("Opening Bulk Order Form...", "info")}
              className="hidden md:flex items-center gap-2 bg-brand-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Boxes size={18} />
              <span>Bulk Order</span>
            </button>

            <div className="flex items-center gap-2 md:gap-4 border-l border-white/10 pl-4 md:pl-6">
              <button 
                className="relative p-2 text-white/80 hover:text-white transition-colors"
                onClick={() => showToast("Shopping cart opened", "info")}
              >
                <ShoppingCart size={22} />
                {calculateTotal() > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-brand-secondary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-brand-primary">
                    !
                  </span>
                )}
              </button>
              
              <button className="p-2 text-white/80 hover:text-white transition-colors">
                <Bell size={22} />
              </button>

              <button className="flex items-center gap-2 pl-2 border-l border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <User size={20} className="text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <div className="lg:hidden px-4 pb-4">
          <div className="flex items-center bg-white/10 rounded-xl p-3 border border-white/10">
            <Search size={18} className="text-white/40 mr-3" />
            <input 
              type="text" 
              placeholder="Search fish, type, supplier..." 
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Trust & Quick Actions */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1">
             <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <RotateCcw size={20} className="text-brand-primary" />
               Quick Reorder
             </h2>
             <div className="space-y-4">
                {PAST_ORDERS.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{order.items}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.date} • ${order.total.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => showToast("Items added to order!", "success")}
                      className="mt-3 sm:mt-0 text-sm font-bold text-brand-primary bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition whitespace-nowrap"
                    >
                      Repeat Order
                    </button>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <ShieldCheck size={100} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={24} className="text-emerald-500" />
                 <h2 className="text-xl font-bold text-gray-900">Trusted by 150+ Businesses</h2>
               </div>
               <p className="text-sm text-gray-600 mb-6">Reliable daily supply for top hotels, restaurants, and retailers.</p>
               
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-sm text-gray-700">
                 "{TESTIMONIALS[0].quote}"
                 <div className="mt-2 font-bold text-gray-900 not-italic text-xs">- {TESTIMONIALS[0].name}, {TESTIMONIALS[0].role}</div>
               </div>
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
           <div className="flex-1 relative min-w-[250px]">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search by fish name..." 
               className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
             />
           </div>
           <button 
             onClick={() => showToast("Subscription options coming soon!", "info")}
             className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 transition whitespace-nowrap"
           >
             <Calendar size={18} />
             Standing Order
           </button>
           <a 
             href={`https://wa.me/919876543210?text=${generateWhatsAppMessage()}`}
             target="_blank"
             rel="noreferrer"
             className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white font-bold rounded-xl text-sm hover:bg-[#20bd5a] transition whitespace-nowrap"
           >
             <MessageCircle size={18} />
             Order via WhatsApp
           </a>
        </div>

        {/* Bulk Ordering Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50/50 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Today's Fresh Catch</h2>
              <p className="text-sm text-gray-500 mt-1">Select quantities to view your bulk pricing.</p>
            </div>
            <button className="text-sm font-bold text-brand-primary flex items-center gap-2 hover:underline">
              <Bell size={16} /> Get Stock Alerts
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Product</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[150px]">Qty (kg)</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[150px]">Price / kg</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/5">Customization</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Slot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {b2bProducts.map(p => {
                  const pId = p.id.toString();
                  const qty = quantities[pId] || 0;
                  const currentPrice = getBulkPrice(p.price, qty);
                  const isDiscounted = qty >= 10;

                  return (
                    <tr key={pId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="font-bold text-gray-900">{p.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.badges.map((b, i) => (
                            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${b.color}`}>
                              {b.text}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Available: {p.stock} kg</div>
                      </td>
                      
                      <td className="p-4 align-top">
                        <div className="flex items-center w-full max-w-[120px] bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary">
                          <button 
                            className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 border-r border-gray-200 font-bold"
                            onClick={() => handleQtyChange(pId, qty - 5)}
                          >-</button>
                          <input 
                            type="number" 
                            min="0"
                            value={qty || ''}
                            onChange={(e) => handleQtyChange(pId, parseInt(e.target.value) || 0)}
                            className="w-full text-center text-sm font-bold p-2 focus:outline-none appearance-none"
                            placeholder="0"
                          />
                          <button 
                            className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 border-l border-gray-200 font-bold"
                            onClick={() => handleQtyChange(pId, qty + 5)}
                          >+</button>
                        </div>
                      </td>

                      <td className="p-4 align-top">
                        <div className="font-bold text-gray-900 text-base">
                          ${currentPrice.toFixed(2)}
                        </div>
                        {isDiscounted && (
                          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                            <TrendingDown size={12} />
                            Bulk applied
                          </div>
                        )}
                        {!isDiscounted && (
                          <div className="text-[10px] text-gray-500 mt-1">
                            Buy 10kg for 5% off
                          </div>
                        )}
                      </td>

                      <td className="p-4 align-top">
                        <select 
                          className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary appearance-none cursor-pointer"
                          value={selectedCuts[pId] || CUT_OPTIONS[0]}
                          onChange={(e) => setSelectedCuts(prev => ({...prev, [pId]: e.target.value}))}
                        >
                          {CUT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </td>

                      <td className="p-4 align-top">
                        <select 
                          className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary appearance-none cursor-pointer"
                          value={selectedSlots[pId] || DELIVERY_SLOTS[0]}
                          onChange={(e) => setSelectedSlots(prev => ({...prev, [pId]: e.target.value}))}
                        >
                          {DELIVERY_SLOTS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
      
      {/* Fixed bottom bar for ordering if total > 0 */}
      {calculateTotal() > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Order Total</p>
              <div className="text-2xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-4">
               <button 
                onClick={() => showToast("Order saved as template!", "success")}
                className="px-6 py-3 font-bold text-brand-primary border border-brand-primary/20 rounded-xl hover:bg-brand-primary/5 transition hidden sm:block"
               >
                 Save as Template
               </button>
               <button 
                onClick={() => showToast("Proceeding to checkout...", "info")}
                className="px-8 py-3 font-bold text-white bg-brand-primary rounded-xl hover:bg-brand-secondary transition shadow-lg shadow-brand-primary/30 whitespace-nowrap"
               >
                 Place Order Now
               </button>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}

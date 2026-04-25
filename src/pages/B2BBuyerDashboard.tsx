import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, TrendingUp, TrendingDown, Star, ChevronRight, Package, DollarSign, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../components/Toast';

export default function B2BBuyerDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const PAST_PURCHASES = [
    { id: 'ORD-9912', date: 'Oct 24, 2024', items: '50kg Seer Fish, 20kg Prawns', total: 42500, status: 'Delivered', supplier: 'Coastal Fisheries Co.' },
    { id: 'ORD-9884', date: 'Oct 21, 2024', items: '100kg Pomfret', total: 85000, status: 'Delivered', supplier: 'Deep Sea Harvesters' },
    { id: 'ORD-9842', date: 'Oct 15, 2024', items: '30kg Crab, 10kg Squid', total: 18000, status: 'Delivered', supplier: 'Coastal Fisheries Co.' },
  ];

  const SAVED_SUPPLIERS = [
    { name: 'Coastal Fisheries Co.', rating: 4.9, activeDeals: 2, tags: ['Seer Fish', 'Premium Prawns'] },
    { name: 'Deep Sea Harvesters', rating: 4.7, activeDeals: 1, tags: ['Pomfret', 'Tuna'] },
    { name: 'Kerala Backwaters Catch', rating: 4.8, activeDeals: 3, tags: ['Crab', 'Pearl Spot'] }
  ];

  const PRICE_TRENDS = [
    { item: 'Seer Fish (Grade A)', current: '₹850/kg', trend: 'down', change: '-5%', lastMonth: '₹895/kg' },
    { item: 'Tiger Prawns (U10)', current: '₹1200/kg', trend: 'up', change: '+2%', lastMonth: '₹1175/kg' },
    { item: 'Black Pomfret', current: '₹650/kg', trend: 'stable', change: '0%', lastMonth: '₹650/kg' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/b2b')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Buyer Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <Download size={16} /> Export Reports
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-xl flex items-center justify-center"><DollarSign size={24} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">MTD Spend</p>
              <p className="text-2xl font-black tracking-tight">₹1,45,500</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Package size={24} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Orders</p>
              <p className="text-2xl font-black tracking-tight">2</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center"><Star size={24} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Saved Suppliers</p>
              <p className="text-2xl font-black tracking-tight">{SAVED_SUPPLIERS.length}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Purchase History & Reorder */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <RotateCcw size={20} className="text-brand-primary" />
                  Purchase History & Reorder
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-white border-b border-gray-100">
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Info</th>
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supplier</th>
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {PAST_PURCHASES.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-sm text-gray-900">{order.items}</div>
                          <div className="text-xs text-gray-500 font-medium mt-1">{order.id} • {order.date}</div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-700">{order.supplier}</span>
                        </td>
                        <td className="p-4 font-black text-gray-900">
                          ₹{order.total.toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => showToast(`Reordering items from ${order.id}`, 'success')}
                            className="text-xs font-bold text-brand-primary border border-brand-primary bg-blue-50/50 px-4 py-2 rounded-lg hover:bg-brand-primary hover:text-white transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                          >
                            1-Click Reorder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Trend Insights */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp size={20} className="text-brand-primary" />
                  Price Trend Insights
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">Market averages compared to your last 30 days.</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRICE_TRENDS.map((trend, i) => (
                  <div key={i} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                    <p className="font-bold text-sm text-gray-900 mb-4 truncate">{trend.item}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest line-through mb-0.5">{trend.lastMonth}</p>
                        <p className="text-xl font-black text-brand-primary tracking-tight">{trend.current}</p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md shadow-sm",
                        trend.trend === 'down' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : trend.trend === 'up' ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-100 text-gray-600 border border-gray-200"
                      )}>
                        {trend.trend === 'down' ? <TrendingDown size={14} /> : trend.trend === 'up' ? <TrendingUp size={14} /> : <div className="w-2 h-0.5 bg-gray-400 rounded-full mx-0.5" />}
                        {trend.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Saved Suppliers */}
          <div className="space-y-8">
            
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Star size={20} className="text-brand-primary" />
                  Saved Suppliers
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {SAVED_SUPPLIERS.map((sup, i) => (
                  <div key={i} className="border border-gray-100 rounded-2xl p-4 hover:border-brand-primary hover:shadow-md transition-all cursor-pointer group bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-primary transition-colors leading-tight pr-2">{sup.name}</h3>
                      <div className="flex items-center gap-1 text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                        <Star size={10} fill="currentColor" /> {sup.rating}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {sup.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-widest bg-gray-50 border border-gray-100 text-gray-500 px-2 py-1 rounded-md">{tag}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                      <span className="text-[11px] font-bold text-brand-secondary flex items-center gap-1">
                        <Package size={12} /> {sup.activeDeals} Active Deals
                      </span>
                      <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

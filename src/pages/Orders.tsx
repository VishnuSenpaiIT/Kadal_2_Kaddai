import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Package, 
  ChevronRight, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Truck,
  ShoppingBag,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../components/Toast';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  weight: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Delivered' | 'Shipped' | 'Cancelled';
  items: OrderItem[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-8842',
    date: '2024-04-25',
    total: 1250,
    status: 'Processing',
    items: [
      { name: 'Fresh Atlantic Salmon', quantity: 2, price: 450, weight: '1kg' },
      { name: 'Tiger Prawns', quantity: 1, price: 350, weight: '500g' }
    ]
  },
  {
    id: 'ORD-2024-7721',
    date: '2024-04-20',
    total: 890,
    status: 'Delivered',
    items: [
      { name: 'Bluefin Sashimi Grade', quantity: 1, price: 890, weight: '250g' }
    ]
  },
  {
    id: 'ORD-2024-6650',
    date: '2024-04-12',
    total: 2100,
    status: 'Delivered',
    items: [
      { name: 'Lobster Tails', quantity: 2, price: 1050, weight: '2pcs' }
    ]
  }
];

export default function Orders() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Shipped': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Cancelled': return 'bg-gray-50 text-gray-500 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return <Clock size={12} />;
      case 'Delivered': return <CheckCircle2 size={12} />;
      case 'Shipped': return <Truck size={12} />;
      default: return <Package size={12} />;
    }
  };

  const handleReorder = (order: Order) => {
    showToast(`Reordering items from ${order.id}...`, 'success');
    // Logic to add all items to cart would go here
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] font-sans text-[#1A2E44]">
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

          <div className="w-24 md:w-32" />
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#0F1C2E] mb-4">My Orders</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <Package size={14} className="text-brand-primary" />
            Track and manage your seafood purchases
          </p>
        </div>

        <div className="space-y-6">
          {MOCK_ORDERS.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-16 border border-blue-50 text-center shadow-xl shadow-blue-900/5"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-brand-primary mx-auto mb-8">
                <Package size={48} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-black text-[#0F1C2E] mb-3">No orders yet</h2>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto font-medium">
                You haven't placed any orders yet. Start shopping to see your history here!
              </p>
              <button 
                onClick={() => navigate('/consumer')}
                className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
              >
                Browse Marketplace
              </button>
            </motion.div>
          ) : (
            MOCK_ORDERS.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[32px] border border-blue-50 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-primary">
                        <Package size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#0F1C2E] group-hover:text-brand-primary transition-colors">{order.id}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} />
                          {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                        getStatusColor(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-8 items-center pt-6 border-t border-blue-50">
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Items</p>
                      <div className="flex -space-x-3 overflow-hidden">
                        {order.items.map((item, i) => (
                          <div 
                            key={i} 
                            className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-brand-primary shadow-sm"
                            title={item.name}
                          >
                            {item.name.charAt(0)}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-black text-brand-primary">
                            +{order.items.length - 3}
                          </div>
                        )}
                        <span className="ml-6 text-sm font-bold text-gray-600 self-center pl-4">
                          {order.items.length} {order.items.length === 1 ? 'Product' : 'Products'}
                        </span>
                      </div>
                    </div>

                    <div className="text-left md:text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-2xl font-black text-[#0F1C2E] flex items-center md:justify-center gap-1">
                        <IndianRupee size={18} className="text-brand-primary" />
                        {order.total}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleReorder(order)}
                        className="flex-1 bg-white border border-blue-100 text-brand-primary px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={14} />
                        Reorder
                      </button>
                      <button 
                        onClick={() => showToast('Order details coming soon!', 'info')}
                        className="flex-1 bg-brand-primary text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/10 flex items-center justify-center gap-2"
                      >
                        Details
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-blue-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black mb-2">Need help with an order?</h3>
              <p className="text-blue-100/60 font-medium text-sm">Our support team is available 24/7 to assist you.</p>
            </div>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
              Contact Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

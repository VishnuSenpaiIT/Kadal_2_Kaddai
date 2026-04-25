import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Anchor, Briefcase, ShieldCheck, Waves } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Entry() {
  const navigate = useNavigate();

  const options = [
    {
      id: 'consumer',
      title: 'Consumer Marketplace',
      description: 'Shop fresh ocean-to-table seafood delivered to your door.',
      icon: Anchor,
      color: 'bg-blue-50 text-blue-600',
      action: () => navigate('/consumer'),
    },
    {
      id: 'b2b',
      title: 'B2B Wholesale',
      description: 'Bulk sourcing and inventory management for restaurants and markets.',
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-600',
      action: () => navigate('/b2b'),
    },
    {
      id: 'admin',
      title: 'Admin Console',
      description: 'Manage platform operations, logistics, and user accounts.',
      icon: ShieldCheck,
      color: 'bg-slate-50 text-slate-600 border border-slate-200',
      action: () => navigate('/admin'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0f2f5]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <Waves size={28} />
          </div>
          <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-20 w-auto mb-4" />
          <h1 className="text-4xl md:text-5xl text-brand-primary">Kadal 2 Kadaai</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Welcome to the world's most transparent seafood supply chain. 
          Please select your portal to continue.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={option.action}
            className="group cursor-pointer bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
          >
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
              option.color
            )}>
              <option.icon size={36} />
            </div>
            <h3 className="text-2xl mb-3 text-gray-900">{option.title}</h3>
            <p className="text-gray-500 leading-relaxed">
              {option.description}
            </p>
            <div className="mt-8 w-12 h-1 bg-gray-100 group-hover:bg-brand-secondary group-hover:w-24 transition-all duration-300" />
          </motion.div>
        ))}
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-gray-400 text-sm font-medium uppercase tracking-widest"
      >
        &copy; 2024 KADAL 2 KADAAI PLATFORMS &bull; OCEAN TO TABLE
      </motion.footer>
    </div>
  );
}

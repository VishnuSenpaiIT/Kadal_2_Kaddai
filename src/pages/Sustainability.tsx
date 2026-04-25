import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Waves, ArrowLeft, ShieldCheck, Leaf, Anchor, Globe } from 'lucide-react';

export default function Sustainability() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#2c3e50]">
      {/* Header */}
      <nav className="p-8 flex items-center justify-between max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/consumer')}
          className="flex items-center gap-2 text-sm font-medium hover:text-brand-secondary transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Market
        </button>
        <div className="flex items-center gap-2 font-bold text-brand-primary">
          <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 w-auto" />
          <span className="text-2xl">Kadal 2 Kadaai</span>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-[0.3em] text-brand-secondary mb-6 block"
        >
          Our Core Mission
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl mb-10 leading-tight"
        >
          Protecting the Ocean, <br/>
          <span className="italic font-light">One Catch at a Time.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto"
        >
          Sustainability isn't a buzzword at Kadal 2 Kadaai—it's the only way we operate. 
          We believe in full transparency and regenerative fishing practices.
        </motion.p>
      </section>

      {/* Philosophy Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1516211697149-d8677f3e82d1?auto=format&fit=crop&q=80&w=1000" 
              alt="Sustainable Fishing"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay" />
          </div>
          <div className="space-y-12">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-3xl mb-4">Certified Sourcing</h3>
              <p className="text-gray-500 leading-relaxed font-sans">
                Every vendor on our platform must pass a rigorous audit reflecting 
                MSC and Monterey Bay Aquarium Seafood Watch guidelines. No exceptions.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-3xl mb-4">Zero Waste Logistics</h3>
              <p className="text-gray-500 leading-relaxed font-sans">
                Our cold-chain delivery uses 100% compostable insulation and reusable gel packs. 
                Our goal is a circular supply chain by 2026.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Anchor size={28} />
              </div>
              <h3 className="text-3xl mb-4">Regenerative Aquaculture</h3>
              <p className="text-gray-500 leading-relaxed font-sans">
                We partner with kelp and shellfish farms that actually improve water 
                quality and restore coastal ecosystems while they grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-brand-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl mb-8">Ready to eat responsibly?</h2>
          <button 
            onClick={() => navigate('/consumer')}
            className="px-10 py-4 bg-brand-secondary text-white rounded-full font-bold hover:scale-105 transition-transform"
          >
            Shop Sustainable Seafood
          </button>
        </div>
      </section>
    </div>
  );
}

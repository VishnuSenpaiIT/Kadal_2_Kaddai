import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat } from 'lucide-react';

const RECIPES = [
  {
    title: 'Lemon Herb Sea Bass',
    time: '25 min',
    serves: '2',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    difficulty: 'Easy'
  },
  {
    title: 'Spicy Garlic Prawns',
    time: '15 min',
    serves: '4',
    image: 'https://images.unsplash.com/photo-1559742811-de6912782e4c?auto=format&fit=crop&q=80&w=800',
    difficulty: 'Easy'
  },
  {
    title: 'Bluefin Tuna Tartare',
    time: '20 min',
    serves: '2',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    difficulty: 'Medium'
  }
];

export default function Recipes() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-8 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <button 
            onClick={() => navigate('/consumer')}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft size={18} />
            Marketplace
          </button>
          <h1 className="text-2xl font-serif text-brand-primary">Ocean Kitchen</h1>
          <div className="w-24" />
        </div>
      </nav>

      <section className="py-20 bg-gray-50/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl text-left mb-16">
            <span className="text-brand-secondary font-bold text-xs uppercase tracking-widest block mb-4">Chef Curated</span>
            <h2 className="text-5xl md:text-6xl text-brand-primary leading-tight mb-6 font-serif">Master the <br/><span className="italic font-light">Art of Seafood</span></h2>
            <p className="text-gray-500 font-sans text-lg">
              Unlock the secrets of preparing fresh catches with the help of our professional culinary team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {RECIPES.map((recipe, i) => (
              <motion.div
                key={recipe.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-[32px] overflow-hidden mb-6">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase text-brand-primary">
                    {recipe.difficulty}
                  </div>
                </div>
                <h3 className="text-2xl mb-4 group-hover:text-brand-secondary transition-colors font-serif">{recipe.title}</h3>
                <div className="flex gap-6 text-gray-400 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {recipe.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    Serves {recipe.serves}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-brand-primary rounded-[48px] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <ChefHat size={48} className="text-brand-secondary mb-8" />
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">Join our Weekly <br/>Live Seafood workshop</h2>
            <p className="text-blue-100/60 mb-10 max-w-sm">Every Friday at 6PM ET. Learn to fillet, season, and sear like a pro.</p>
            <button className="px-8 py-4 bg-brand-secondary text-white rounded-xl font-bold hover:scale-105 transition-transform">
              Register for Next Session
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

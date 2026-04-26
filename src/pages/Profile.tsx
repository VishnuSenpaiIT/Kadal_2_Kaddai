import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Plus, 
  Package, 
  ChevronRight, 
  ShieldCheck,
  Bell,
  LogOut,
  Home,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../components/Toast';

interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  address: string;
  isDefault: boolean;
}

export default function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [userData] = useState({
    name: 'Srivishnu Senpai',
    email: 'srivishnu@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  });

  const [addresses] = useState<Address[]>([
    {
      id: '1',
      type: 'Home',
      address: '123 Ocean Drive, Marina Layout, Chennai - 600001',
      isDefault: true
    },
    {
      id: '2',
      type: 'Work',
      address: '45 Tech Park, Block B, 4th Floor, OMR, Chennai - 600096',
      isDefault: false
    }
  ]);

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

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Sidebar / Profile Summary */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-blue-50 shadow-xl shadow-blue-900/5 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50">
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-brand-secondary transition-colors">
                  <Edit3 size={14} />
                </button>
              </div>
              <h2 className="text-xl font-black text-[#0F1C2E] mb-1">{userData.name}</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Premium Member</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-50 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} className="text-brand-primary" />
                    <span className="text-sm font-bold text-[#0F1C2E]">My Orders</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group text-gray-400">
                  <div className="flex items-center gap-3">
                    <Bell size={18} />
                    <span className="text-sm font-bold">Notifications</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group text-gray-400">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} />
                    <span className="text-sm font-bold">Privacy</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </button>
              </div>

              <button className="w-full mt-12 pt-6 border-t border-blue-50 flex items-center justify-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-8">
            {/* Account Details */}
            <section className="bg-white p-8 md:p-10 rounded-[48px] border border-blue-50 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#0F1C2E]">Profile Information</h3>
                <button 
                  onClick={() => showToast('Edit profile feature coming soon!', 'info')}
                  className="text-xs font-black text-brand-primary uppercase tracking-widest flex items-center gap-2 hover:text-brand-secondary transition-colors"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} className="text-brand-primary" />
                    Full Name
                  </p>
                  <p className="font-black text-[#0F1C2E]">{userData.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} className="text-brand-primary" />
                    Email Address
                  </p>
                  <p className="font-black text-[#0F1C2E]">{userData.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={12} className="text-brand-primary" />
                    Phone Number
                  </p>
                  <p className="font-black text-[#0F1C2E]">{userData.phone}</p>
                </div>
              </div>
            </section>

            {/* Saved Addresses */}
            <section className="bg-white p-8 md:p-10 rounded-[48px] border border-blue-50 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#0F1C2E]">Saved Addresses</h3>
                <button 
                  onClick={() => showToast('Add address feature coming soon!', 'info')}
                  className="text-xs font-black text-brand-primary uppercase tracking-widest flex items-center gap-2 hover:text-brand-secondary transition-colors"
                >
                  <Plus size={16} />
                  Add New
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    className={cn(
                      "p-6 rounded-3xl border transition-all flex items-start gap-4 group",
                      addr.isDefault ? "bg-blue-50/30 border-blue-100" : "bg-white border-gray-100 hover:border-blue-100"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      addr.isDefault ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-brand-primary transition-colors"
                    )}>
                      {addr.type === 'Home' ? <Home size={18} /> : addr.type === 'Work' ? <Briefcase size={18} /> : <MapPin size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-[#0F1C2E]">{addr.type}</span>
                        {addr.isDefault && (
                          <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        {addr.address}
                      </p>
                    </div>
                    <button className="text-gray-300 hover:text-brand-primary transition-colors p-1">
                      <Edit3 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

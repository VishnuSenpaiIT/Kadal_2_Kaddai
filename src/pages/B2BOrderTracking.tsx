import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Truck, Package, Clock, AlertCircle, Phone, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../components/Toast';

export default function B2BOrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const currentStatus = 2; // 0: Placed, 1: Packed, 2: Shipped, 3: Delivered

  const stages = [
    { title: 'Order Placed', time: '08:30 AM', date: 'Today', icon: Clock },
    { title: 'Packed & Quality Checked', time: '10:15 AM', date: 'Today', icon: Package },
    { title: 'Shipped (Cold Chain)', time: '11:45 AM', date: 'Today', icon: Truck },
    { title: 'Delivered', time: 'Est. 02:30 PM', date: 'Today', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold">Track Order</h1>
              <p className="text-xs text-gray-500 font-medium">#{orderId || 'B2B-8830'}</p>
            </div>
          </div>
          <button 
            onClick={() => showToast('Opening issue report form...', 'info')}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            <AlertCircle size={14} /> Report Issue
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        
        {/* Live Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
              <h2 className="text-2xl font-black text-brand-primary">On the Way</h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ETA</p>
              <h2 className="text-2xl font-black text-emerald-600">02:30 PM</h2>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100" />
            <div className="absolute left-6 top-6 bottom-[50%] w-0.5 bg-brand-primary" /> {/* Active Line */}
            
            <div className="space-y-8">
              {stages.map((stage, idx) => {
                const isActive = idx <= currentStatus;
                const Icon = stage.icon;
                return (
                  <div key={idx} className="relative flex items-start gap-6">
                    <div className={cn(
                      "relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2",
                      isActive ? "bg-white border-brand-primary text-brand-primary" : "bg-gray-50 border-gray-100 text-gray-400"
                    )}>
                      <Icon size={20} />
                    </div>
                    <div className="pt-2">
                      <h3 className={cn("font-bold text-sm", isActive ? "text-gray-900" : "text-gray-400")}>{stage.title}</h3>
                      <p className="text-xs font-medium text-gray-500 mt-1">{stage.date}, {stage.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Delivery Partner Details */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Delivery Partner</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Truck size={20} className="text-brand-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900">ColdTrans Logistics</p>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-500 mt-0.5">
                  <MapPin size={12} /> Vehicle: TN-04-AB-1234 (Refrigerated)
                </div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-colors cursor-pointer">
              <Phone size={16} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

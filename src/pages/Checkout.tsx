import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, Truck, MapPin, CheckCircle2, ShieldCheck, Waves } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setComplete(true);
  };

  if (complete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-bg text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[48px] shadow-2xl max-w-md w-full border border-gray-100"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-serif text-brand-primary mb-4">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your fresh seafood is being prepared for transit. You will receive a tracking link via email shortly.
          </p>
          <button 
            onClick={() => navigate('/consumer')}
            className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-secondary transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <nav className="p-8 flex items-center justify-between bg-white border-b border-gray-200">
        <button 
          onClick={() => navigate('/consumer')}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-primary"
        >
          <ArrowLeft size={18} />
          Return
        </button>
        <div className="flex items-center gap-2 font-bold text-brand-primary">
          <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 w-auto" />
          <span className="text-2xl">Kadal 2 Kadaai</span>
        </div>
        <div className="w-24" />
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12 relative px-4">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -translate-y-1/2 z-0" />
            {[
              { id: 1, label: 'Delivery', icon: Truck },
              { id: 2, label: 'Payment', icon: CreditCard },
              { id: 3, label: 'Review', icon: CheckCircle2 },
            ].map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  step >= s.id ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  <s.icon size={18} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  step >= s.id ? 'text-brand-primary' : 'text-gray-400'
                }`}>{s.label}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100"
              >
                <h3 className="text-2xl font-serif text-brand-primary mb-8">Shipping Address</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-colors" />
                    <input type="text" placeholder="Last Name" className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-colors" />
                  </div>
                  <input type="text" placeholder="Street Address" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-colors" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="City" className="col-span-1 p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-colors" />
                    <input type="text" placeholder="State" className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-colors" />
                    <input type="text" placeholder="Zip" className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100"
              >
                <h3 className="text-2xl font-serif text-brand-primary mb-8">Payment Method</h3>
                <div className="space-y-6">
                  <div className="p-6 border-2 border-brand-primary rounded-2xl bg-blue-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CreditCard className="text-brand-primary" />
                      <span className="font-bold">Card ending in 4242</span>
                    </div>
                    <span className="text-xs font-bold text-brand-primary uppercase">Active</span>
                  </div>
                  <button className="w-full p-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:bg-gray-50 transition-all">
                    + Add New Payment Method
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100"
              >
                <h3 className="text-2xl font-serif text-brand-primary mb-8">Final Review</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                      <Truck className="text-gray-400" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Delivery</p>
                        <p className="text-sm font-bold text-gray-950">Express Cold-Chain (Next Day)</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                      <MapPin className="text-gray-400" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Address</p>
                        <p className="text-sm font-bold text-gray-950">123 Ocean Way, San Francisco, CA</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4">
             {step > 1 && (
               <button 
                onClick={() => setStep(step - 1)}
                className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
               >
                Back
               </button>
             )}
             <button 
              onClick={handleNext}
              className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-secondary transition-all shadow-xl shadow-blue-900/10"
             >
              {step === 3 ? 'Place Order' : 'Continue'}
             </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
             <h4 className="text-lg font-serif mb-6">Order Summary</h4>
             <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between">
                   <span className="text-gray-500">Subtotal</span>
                   <span className="font-bold">$113.49</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                   <span>Shipping (Cold Chain)</span>
                   <span className="font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-500">Processing Fee</span>
                   <span className="font-bold">$2.50</span>
                </div>
                <div className="h-[1px] bg-gray-100 my-2" />
                <div className="flex justify-between text-lg">
                   <span className="font-bold">Total</span>
                   <span className="font-bold text-brand-primary">$115.99</span>
                </div>
             </div>
             <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
                <ShieldCheck size={20} className="text-brand-primary shrink-0" />
                <p className="text-[10px] leading-relaxed text-blue-900 font-medium">
                  Your purchase is protected by our Sea-Quality guarantee. If the freshness is not 100%, we refund you.
                </p>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
}

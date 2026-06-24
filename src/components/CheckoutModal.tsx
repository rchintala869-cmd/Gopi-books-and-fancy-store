import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Smartphone, Home, Store, ArrowRight, MessageCircle } from 'lucide-react';
import { CartItem, CustomerDetails, Order } from '../types';
import { generateWhatsAppLink } from '../utils';

interface CheckoutModalProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
}

export function CheckoutModal({ cart, total, onClose, onOrderComplete }: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Customer Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Order Preferences
  const [delivery, setDelivery] = useState<'Home Delivery' | 'Take in Shop'>('Home Delivery');
  const [payment, setPayment] = useState<'PhonePe' | 'Card'>('PhonePe');

  // Mock Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Mock PhonePe Details
  const [upiId, setUpiId] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone && (delivery === 'Take in Shop' || address)) {
      setStep(2);
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate minor validation for the mock inputs
    if (payment === 'Card' && (!cardNumber || !cardExpiry || !cardCvv)) return;
    if (payment === 'PhonePe' && !upiId) return;

    const details: CustomerDetails = {
      name,
      phone,
      address: delivery === 'Home Delivery' ? address : undefined
    };

    const link = generateWhatsAppLink(cart, delivery, payment, details, total);
    
    // Save order history
    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...cart],
      total,
      deliveryMode: delivery,
      paymentMode: payment,
      customerDetails: details
    };
    
    // Open WhatsApp
    window.open(link, '_blank');
    
    // Complete order and close
    onOrderComplete(order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shrink-0">
          <div>
            <h2 className="text-xl font-display font-semibold">Checkout</h2>
            <p className="text-indigo-100 text-sm opacity-90 mt-0.5">Total Amount: ₹{total}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 text-lg">Contact Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="+91 9876543210" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 text-lg">Delivery Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDelivery('Home Delivery')}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${delivery === 'Home Delivery' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}
                    >
                      <Home className={`w-6 h-6 ${delivery === 'Home Delivery' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="font-medium text-slate-800">Home Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDelivery('Take in Shop')}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${delivery === 'Take in Shop' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}
                    >
                      <Store className={`w-6 h-6 ${delivery === 'Take in Shop' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="font-medium text-slate-800">Take in Shop</span>
                    </button>
                  </div>
                  
                  {delivery === 'Home Delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-medium text-slate-700 mb-1 mt-2">Delivery Address</label>
                      <textarea required rows={2} value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" placeholder="Enter full address details..." />
                    </motion.div>
                  )}
                </div>

                <button type="submit" className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleConfirmOrder} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← Back</button>
                    <h3 className="font-semibold text-slate-800 text-lg">Payment Method</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayment('PhonePe')}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${payment === 'PhonePe' ? 'border-[#5f259f] bg-[#5f259f]/5 ring-1 ring-[#5f259f]' : 'border-slate-200 hover:border-purple-300'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone className={`w-5 h-5 ${payment === 'PhonePe' ? 'text-[#5f259f]' : 'text-slate-400'}`} />
                        <span className="font-bold text-[#5f259f]">PhonePe</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">UPI / Wallet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment('Card')}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${payment === 'Card' ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className={`w-5 h-5 ${payment === 'Card' ? 'text-slate-900' : 'text-slate-400'}`} />
                        <span className="font-bold text-slate-900">Card</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Debit / Credit</span>
                    </button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    {payment === 'PhonePe' ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-[#5f259f]/30 rounded-xl">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=9704329354@ybl&pn=Gopi%20Books%20And%20Fancy%20Store&am=${total}`} 
                            alt="PhonePe QR Code" 
                            className="w-32 h-32 rounded-lg"
                          />
                          <p className="text-sm font-semibold text-slate-700 mt-3">Scan to Pay with PhonePe</p>
                          <p className="text-xs text-slate-500 mt-1">UPI: 9704329354@ybl</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-slate-700">Verify UPI ID or Reference No.</label>
                          <input required type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5f259f] focus:border-[#5f259f] outline-none transition-all" placeholder="yourname@ybl or Ref No." />
                          <p className="text-xs text-slate-500">We will include this in your WhatsApp order for verification.</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Card Number</label>
                          <input required type="text" maxLength={19} value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none font-mono" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Expiry Date</label>
                            <input required type="text" maxLength={5} value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none font-mono" placeholder="MM/YY" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">CVV</label>
                            <input required type="password" maxLength={4} value={cardCvv} onChange={e => setCardCvv(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none font-mono" placeholder="•••" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-4 px-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-semibold shadow-lg shadow-green-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Confirm Order on WhatsApp
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-3">You will be redirected to WhatsApp to finalize your order with Gopi Books & Fancy Store.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Package, Store, MapPin, IndianRupee, ArrowLeft, Send, CheckCircle2, Truck, Check, Trash2 } from 'lucide-react';
import { Order, CartItem } from '../types';

interface OrderHistoryModalProps {
  orders: Order[];
  onClearHistory?: () => void;
  onClose: () => void;
}

export function OrderHistoryModal({ orders, onClearHistory, onClose }: OrderHistoryModalProps) {
  const [returnItem, setReturnItem] = useState<{order: Order, item: CartItem} | null>(null);
  const [returnReason, setReturnReason] = useState('');

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnItem || !returnReason) return;
    
    const phoneNumber = '919704329354';
    let message = `*🔄 Return Request for Gopi Books & Fancy Store*\n\n`;
    message += `*Order #*: ${returnItem.order.id}\n`;
    message += `*Product*: ${returnItem.item.name}\n`;
    message += `*Qty*: ${returnItem.item.quantity}\n`;
    message += `*Reason for Return*: ${returnReason}\n\n`;
    message += `Please process my return request.`;

    const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
    
    setReturnItem(null);
    setReturnReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white shrink-0">
          <div className="flex items-center gap-2">
            {returnItem ? (
              <button 
                onClick={() => setReturnItem(null)}
                className="mr-2 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <Clock className="w-6 h-6" />
            )}
            <h2 className="text-xl font-display font-semibold">
              {returnItem ? 'Return Product' : 'Order History'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 bg-slate-50 flex-1">
          <AnimatePresence mode="wait">
            {returnItem ? (
              <motion.div
                key="return-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={returnItem.item.imageUrl} alt={returnItem.item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 line-clamp-1">{returnItem.item.name}</h3>
                    <p className="text-sm text-slate-500">Order #{returnItem.order.id}</p>
                  </div>
                </div>

                <form onSubmit={handleReturnSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Why are you returning this product?
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="Please explain the issue (e.g., damaged, not what I expected, etc.)"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none shadow-sm"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Return Request via WhatsApp
                  </button>
                </form>
              </motion.div>
            ) : orders.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 flex flex-col items-center"
              >
                <Package className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No Past Orders</h3>
                <p className="text-slate-500 mt-2">You haven't placed any orders yet.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {onClearHistory && orders.length > 0 && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={onClearHistory}
                      className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-semibold border border-rose-200 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear History
                    </button>
                  </div>
                )}
                {orders.map(order => {
                  const status = order.status || 'Pending';
                  
                  return (
                  <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-xs text-slate-500 font-medium">
                            Order #{order.id}
                          </p>
                        </div>
                        <p className="font-semibold text-slate-800">
                          {new Date(order.date).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric', 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium mb-1">Total Amount</p>
                        <p className="font-display font-bold text-lg text-emerald-600 flex items-center gap-1 justify-end">
                          <IndianRupee className="w-4 h-4" /> {order.total}
                        </p>
                      </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="mb-6 px-2">
                      <div className="relative flex items-center justify-between">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full" />
                        <div 
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: status === 'Delivered' ? '100%' : status === 'Shipped' ? '50%' : '0%' }}
                        />
                        
                        {/* Pending Step */}
                        <div className="relative flex flex-col items-center gap-2 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${status === 'Pending' || status === 'Shipped' || status === 'Delivered' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <Package className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${status === 'Pending' || status === 'Shipped' || status === 'Delivered' ? 'text-emerald-700' : 'text-slate-400'}`}>Pending</span>
                        </div>

                        {/* Shipped Step */}
                        <div className="relative flex flex-col items-center gap-2 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${status === 'Shipped' || status === 'Delivered' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${status === 'Shipped' || status === 'Delivered' ? 'text-emerald-700' : 'text-slate-400'}`}>Shipped</span>
                        </div>

                        {/* Delivered Step */}
                        <div className="relative flex flex-col items-center gap-2 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${status === 'Delivered' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <Check className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${status === 'Delivered' ? 'text-emerald-700' : 'text-slate-400'}`}>Delivered</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.name}</p>
                                <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price}</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-slate-700">₹{item.price * item.quantity}</p>
                          </div>
                          <div className="flex justify-end mt-1">
                            <button 
                              onClick={() => setReturnItem({order, item})}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-rose-200 bg-white"
                            >
                              Return this Product
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 font-medium mb-1 flex items-center gap-1">
                          {order.deliveryMode === 'Home Delivery' ? <MapPin className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                          {order.deliveryMode}
                        </p>
                        {order.customerDetails.address && (
                          <p className="text-slate-700 line-clamp-2">{order.customerDetails.address}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium mb-1">Customer Info</p>
                        <p className="text-slate-700">{order.customerDetails.name}</p>
                        <p className="text-slate-700">{order.customerDetails.phone}</p>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

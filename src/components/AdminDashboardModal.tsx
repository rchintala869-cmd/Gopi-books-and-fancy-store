import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Package, Truck, Check, Store, MapPin, IndianRupee, Trash2 } from 'lucide-react';
import { Order, Product } from '../types';

interface AdminDashboardModalProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: 'Pending' | 'Shipped' | 'Delivered') => void;
  onClearHistory?: () => void;
  onClose: () => void;
}

export function AdminDashboardModal({ orders, onUpdateOrderStatus, onClearHistory, onClose }: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6" />
            <h2 className="text-xl font-display font-semibold">Store Dashboard</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="mb-6 flex gap-2 justify-between items-center">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'orders' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
              >
                Manage Orders
              </button>
            </div>
            {activeTab === 'orders' && orders.length > 0 && onClearHistory && (
              <button
                onClick={onClearHistory}
                className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-semibold border border-rose-200 transition-colors flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            )}
          </div>

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No orders received yet.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Order #{order.id}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.date).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'short', day: 'numeric', 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600">Status:</span>
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as 'Pending' | 'Shipped' | 'Delivered')}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-100 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Details</h4>
                        <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1">
                          <p className="font-semibold text-slate-800">{order.customerDetails.name}</p>
                          <p className="text-slate-600">{order.customerDetails.phone}</p>
                          <p className="text-slate-600 flex items-center gap-1 mt-1">
                            {order.deliveryMode === 'Home Delivery' ? <MapPin className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                            {order.deliveryMode}
                          </p>
                          {order.customerDetails.address && (
                            <p className="text-slate-600 mt-1">{order.customerDetails.address}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Items ({order.items.length})</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-slate-700 line-clamp-1 flex-1">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                              <span className="font-medium text-slate-800 shrink-0 ml-2">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center">
                            <span className="font-semibold text-slate-800">Total Paid via {order.paymentMode}</span>
                            <span className="font-display font-bold text-emerald-600">₹{order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

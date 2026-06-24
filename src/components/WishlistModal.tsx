import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  wishlist: Product[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export function WishlistModal({ wishlist, onClose, onRemove, onAddToCart }: WishlistModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-500 to-pink-500 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 fill-white" />
            <h2 className="text-xl font-display font-semibold">Your Wishlist</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
              <Heart className="w-16 h-16 opacity-20 mb-4" />
              <p className="font-medium text-slate-500">Your wishlist is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {wishlist.map(product => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={product.id} 
                    className="flex gap-4 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm"
                  >
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100" />
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-semibold text-slate-900 line-clamp-1">{product.name}</h4>
                      <p className="text-indigo-600 font-bold mt-1">₹{product.price}</p>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <button 
                          onClick={() => {
                            onAddToCart(product);
                            onRemove(product.id);
                          }}
                          className="flex-1 py-1.5 px-3 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                        </button>
                        <button 
                          onClick={() => onRemove(product.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

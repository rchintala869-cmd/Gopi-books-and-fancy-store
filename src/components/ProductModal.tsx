import { motion } from 'motion/react';
import { X, ShoppingCart, Zap, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export function ProductModal({ product, onClose, onAddToCart, onBuyNow }: ProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          <button 
            onClick={onClose} 
            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full md:hidden text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col relative overflow-y-auto">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full hidden md:block transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Tag className="w-3 h-3" /> {product.category}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2 leading-tight">
            {product.name}
          </h2>
          
          <p className="text-3xl font-display font-bold text-indigo-600 mb-6">
            ₹{product.price}
          </p>
          
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-2">Product Description</h3>
            <p className="text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            <button 
              onClick={() => {
                onAddToCart(product);
                onClose();
              }} 
              className="w-full py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button 
              onClick={() => onBuyNow(product)} 
              className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" /> Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

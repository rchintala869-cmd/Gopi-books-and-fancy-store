import { useState, useMemo } from 'react';
import { Search, ShoppingCart, Plus, Store, Trash2, Minus, Plus as PlusIcon, Tag, MapPin, Clock, Heart, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_PRODUCTS, CATEGORIES } from './data';
import { useLocalStorage } from './hooks';
import { Product, CartItem, Order } from './types';
import { AddProductModal } from './components/AddProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { WishlistModal } from './components/WishlistModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

export default function App() {
  const [products, setProducts] = useLocalStorage<Product[]>('gopi-products', DEFAULT_PRODUCTS);
  const [cart, setCart] = useLocalStorage<CartItem[]>('gopi-cart', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('gopi-orders', []);
  const [wishlistIds, setWishlistIds] = useLocalStorage<string[]>('gopi-wishlist', []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Computed wishlist products
  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0)); // Backup filter although it shouldn't hit 0 due to logic below
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    setSelectedProduct(null);
    setIsCartSidebarOpen(false);
    setIsCheckoutOpen(true);
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const updateOrderStatus = (orderId: string, status: 'Pending' | 'Shipped' | 'Delivered') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pb-24 font-sans bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-fuchsia-600">
            <div className="w-10 h-10 bg-fuchsia-100 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-fuchsia-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900 leading-tight">
                Gopi Books & Fancy Store
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Store #9704329354
                </p>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Helpline: 9704329354
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsOrderHistoryOpen(true)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors flex items-center justify-center"
              title="Order History"
            >
              <Clock className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-rose-500 rounded-full transition-colors flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {wishlistIds.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsCartSidebarOpen(true)}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=2000"
          alt="Education and Stationery" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-gradient-to-t from-slate-900/60 to-transparent">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-lg leading-tight">
              Empowering Minds, Sparking Creativity
            </h2>
            <p className="text-lg md:text-xl text-indigo-50 font-medium drop-shadow-md italic">
              "Your premium destination for educational books, fine stationery, and beautiful fancy items."
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar & Categories Banner */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="relative shadow-xl rounded-2xl bg-white border border-slate-100 p-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search books, stationery, fancy items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-3.5 bg-transparent outline-none transition-all text-slate-800 text-lg placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedCategory === category 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="h-40 overflow-hidden relative bg-slate-100">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {product.category}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:scale-110 active:scale-95 transition-all shadow-sm"
                  >
                    <Heart 
                      className={`w-4 h-4 ${wishlistIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} 
                    />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-semibold text-lg text-slate-900 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 flex-1">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display font-bold text-xl text-indigo-600">₹{product.price}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl shadow-md transition-transform active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Owner Dashboard Card */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-3xl overflow-hidden hover:border-indigo-300 hover:bg-indigo-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[300px] group"
            onClick={() => setIsAdminOpen(true)}
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Store className="w-8 h-8 text-indigo-600" />
            </div>
            <span className="font-display font-semibold text-lg text-indigo-900">Manage Orders</span>
            <span className="text-sm font-medium text-indigo-600 mt-1">Owner Dashboard</span>
          </motion.div>

          {/* Add Product Card */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-fuchsia-50 border-2 border-dashed border-fuchsia-200 rounded-3xl overflow-hidden hover:border-fuchsia-300 hover:bg-fuchsia-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[300px] group"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-fuchsia-600" />
            </div>
            <span className="font-display font-semibold text-lg text-fuchsia-900">Add Product</span>
            <span className="text-sm font-medium text-fuchsia-600 mt-1">Create new item</span>
          </motion.div>
        </div>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  Your Cart
                </h2>
                <button 
                  onClick={() => setIsCartSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-slate-400 hidden" /> {/* Hidden icon to balance layout if needed */}
                  <Plus className="w-6 h-6 text-slate-400 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <ShoppingCart className="w-16 h-16 opacity-20" />
                    <p className="font-medium text-slate-500">Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {cart.map(item => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          key={item.id} 
                          className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                          <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0 bg-white" />
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-semibold text-slate-900 line-clamp-1">{item.name}</h4>
                            <p className="text-indigo-600 font-bold mt-1">₹{item.price}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-1">
                                <button 
                                  onClick={() => {
                                    if (item.quantity > 1) updateCartQuantity(item.id, -1);
                                    else removeFromCart(item.id);
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQuantity(item.id, 1)}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                >
                                  <PlusIcon className="w-3 h-3" />
                                </button>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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

              {cart.length > 0 && (
                <div className="p-5 border-t border-slate-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="text-2xl font-display font-bold text-slate-900">₹{cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartSidebarOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddProductModal 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={(product) => {
              setProducts(prev => [product, ...prev]);
              setIsAddModalOpen(false);
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal 
            cart={cart}
            total={cartTotal}
            onClose={() => setIsCheckoutOpen(false)}
            onOrderComplete={(order) => {
              setOrders(prev => [order, ...prev]);
              setCart([]);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOrderHistoryOpen && (
          <OrderHistoryModal
            orders={orders}
            onClearHistory={() => setOrders([])}
            onClose={() => setIsOrderHistoryOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminDashboardModal
            orders={orders}
            onUpdateOrderStatus={updateOrderStatus}
            onClearHistory={() => setOrders([])}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
            onBuyNow={handleBuyNow}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWishlistOpen && (
          <WishlistModal
            wishlist={wishlistProducts}
            onClose={() => setIsWishlistOpen(false)}
            onRemove={toggleWishlist}
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

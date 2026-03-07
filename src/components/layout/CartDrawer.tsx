import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, items, updateQuantity, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#B8965A]" />
                <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Your Cart ({items.length})</h2>
              </div>
              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[#1A1A1A]" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[#1A1A1A]">Your cart is empty</p>
                    <p className="text-gray-500 text-sm mt-1">Looks like you haven't added anything yet.</p>
                  </div>
                  <button 
                    onClick={toggleCart}
                    className="mt-4 px-6 py-2 bg-[#1A1A1A] text-white rounded-full text-sm font-medium hover:bg-[#B8965A] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartId} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-[#1A1A1A] line-clamp-2 pr-4">{item.name}</h3>
                          <button 
                            onClick={() => removeItem(item.cartId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {(item.size || item.color) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' | '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-50 text-gray-500 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50 text-gray-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-medium text-[#1A1A1A]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-[#FAF7F2] border-t border-gray-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#1A1A1A]">
                    <span>Total</span>
                    <span className="text-[#B8965A]">{formatPrice(cartTotal)}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Shipping & taxes calculated at checkout</p>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#B8965A] text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#9A7D4B] transition-all rounded-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Proceed to Checkout
                </button>
                
                <button 
                  onClick={() => {
                    toggleCart();
                    navigate('/cart');
                  }}
                  className="w-full text-center text-sm text-gray-500 hover:text-[#1A1A1A] underline decoration-gray-300 underline-offset-4"
                >
                  View Full Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

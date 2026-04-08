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
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F5F1EB] z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E8DED1] flex items-center justify-between bg-transparent">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#111111] stroke-[1.5]" />
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#111111]">Your Cart ({items.length})</h2>
              </div>
              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-[#E8DED1] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#111111]" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-[#E8DED1]/30 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-[#111111] stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="text-sm font-sans uppercase tracking-[0.2em] text-[#111111] mb-2">Your cart is empty</p>
                    <p className="text-[#555555] font-light text-sm">Looks like you haven't added anything yet.</p>
                  </div>
                  <button 
                    onClick={toggleCart}
                    className="mt-4 px-8 py-3 bg-transparent border border-[#111111] text-[#111111] text-[10px] uppercase tracking-[0.2em] hover:bg-[#111111] hover:text-[#F5F1EB] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartId} className="flex gap-6 group">
                    <div className="w-24 h-32 bg-[#E8DED1]/30 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-sans tracking-[0.1em] text-[#111111] uppercase line-clamp-2 pr-4">{item.name}</h3>
                          <button 
                            onClick={() => removeItem(item.cartId)}
                            className="text-[#999999] hover:text-[#111111] transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {(item.size || item.color) && (
                          <p className="text-[10px] text-[#555555] uppercase tracking-widest mt-2">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' | '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-[#E8DED1]">
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="p-2 hover:bg-[#E8DED1]/50 text-[#555555] disabled:opacity-30 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-light text-[#111111]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="p-2 hover:bg-[#E8DED1]/50 text-[#555555] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-light tracking-wide text-[#111111]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-transparent border-t border-[#E8DED1] space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-[#555555] uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="font-light text-[#111111]">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans tracking-[0.1em] text-[#111111] uppercase">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <p className="text-[10px] text-[#999999] text-center uppercase tracking-widest">Shipping & taxes calculated at checkout</p>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#111111] text-[#F5F1EB] py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <button 
                  onClick={() => {
                    toggleCart();
                    navigate('/cart');
                  }}
                  className="w-full text-center text-[10px] text-[#555555] uppercase tracking-[0.2em] border-b border-transparent hover:border-[#111111] hover:text-[#111111] transition-all pb-1 mx-auto block w-max"
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

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

export default function Cart() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-[#F5F1EB] min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-[#E8DED1] rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-8 h-8 text-[#111111] stroke-[1.5]" />
        </div>
        <h2 className="text-3xl font-serif text-[#111111] mb-4 tracking-[0.1em] font-light">Your cart is empty</h2>
        <p className="text-[#555555] mb-12 font-light">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/shop" 
          className="inline-block bg-[#111111] text-[#F5F1EB] px-10 py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#C6A76E] transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-[#F5F1EB] min-h-screen">
      <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-16 tracking-[0.1em] font-light">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-[#F5F1EB] border-t border-[#E8DED1]">
            <div className="hidden md:grid grid-cols-12 gap-4 py-6 border-b border-[#E8DED1] text-[10px] font-sans text-[#555555] uppercase tracking-[0.2em]">
              <div className="col-span-6">Piece</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-[#E8DED1] items-center"
                >
                  <div className="col-span-6 flex items-center gap-6">
                    <div className="w-24 h-32 bg-[#E8DED1] overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm tracking-[0.1em] uppercase text-[#111111] mb-2">{item.name}</h3>
                      <p className="text-xs text-[#999999] font-light tracking-widest uppercase">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' | '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <button 
                        onClick={() => removeItem(item.cartId)}
                        className="text-[#555555] text-[10px] uppercase tracking-[0.2em] mt-4 hover:text-[#111111] transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-light text-[#111111]">
                    {formatPrice(item.price)}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border-b border-[#111111]">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="p-2 hover:opacity-70 text-[#111111] transition-opacity"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-light text-[#111111]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="p-2 hover:opacity-70 text-[#111111] transition-opacity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right font-light text-[#111111]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-12 flex justify-between items-center">
            <Link to="/shop" className="text-[#111111] hover:text-[#C6A76E] text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-colors">
              <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
            </Link>
            <button 
              onClick={clearCart}
              className="text-[#999999] hover:text-[#111111] text-xs uppercase tracking-[0.2em] transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-[#F5F1EB] p-8 border border-[#E8DED1] sticky top-32">
            <h2 className="text-2xl font-serif text-[#111111] mb-8 tracking-[0.1em] font-light">Order Summary</h2>
            
            <div className="space-y-6 mb-8 pb-8 border-b border-[#E8DED1]">
              <div className="flex justify-between text-[#555555] font-light">
                <span>Subtotal</span>
                <span className="text-[#111111]">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[#555555] font-light">
                <span>Delivery</span>
                <span className="text-xs text-[#999999] tracking-widest uppercase">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-10">
              <span className="text-sm uppercase tracking-[0.2em] text-[#111111]">Total</span>
              <span className="text-2xl font-light text-[#111111]">{formatPrice(cartTotal)}</span>
            </div>

            <Link 
              to="/checkout"
              className="block w-full bg-[#111111] text-[#F5F1EB] text-center py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#C6A76E] transition-colors"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-8 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#999999] flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

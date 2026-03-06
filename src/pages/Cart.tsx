import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

export default function Cart() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-3xl font-serif text-[#1A1A1A] mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/shop" 
          className="inline-block bg-[#1A1A1A] text-white px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-[#333] transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-[#1A1A1A] mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
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
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b border-gray-100 items-center"
                >
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' | '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <button 
                        onClick={() => removeItem(item.cartId)}
                        className="text-red-500 text-xs uppercase tracking-wider mt-2 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-medium text-[#1A1A1A]">
                    {formatPrice(item.price)}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right font-bold text-[#1A1A1A]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link to="/shop" className="text-[#1A1A1A] hover:text-[#B8965A] font-medium flex items-center gap-2 transition-colors">
              <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
            </Link>
            <button 
              onClick={clearCart}
              className="text-gray-500 hover:text-red-500 text-sm transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-[#1A1A1A]">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-sm text-gray-400">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-[#1A1A1A]">Total</span>
              <span className="text-2xl font-serif font-bold text-[#B8965A]">{formatPrice(cartTotal)}</span>
            </div>

            <Link 
              to="/checkout"
              className="block w-full bg-[#B8965A] text-white text-center py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#9A7D4B] transition-all hover:shadow-lg active:scale-95 rounded-sm"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId || "CENESK-XXXXX";

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-12 h-12 text-green-600" />
      </motion.div>
      
      <h1 className="text-4xl font-serif text-[#1A1A1A] mb-4">Thank you for your order! 🎉</h1>
      <p className="text-gray-500 mb-2">Your order has been placed successfully.</p>
      <p className="text-lg font-bold text-[#1A1A1A] mb-8">Order Number: {orderId}</p>
      
      <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto mb-8">
        <p className="text-sm text-gray-600 mb-2">You'll receive a confirmation on WhatsApp shortly.</p>
        <p className="text-sm text-gray-600">We will contact you regarding delivery updates.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          to="/shop" 
          className="bg-[#1A1A1A] text-white px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-[#333] transition-colors rounded-sm"
        >
          Continue Shopping
        </Link>
        <Link 
          to="/track-order" 
          className="border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-gray-50 transition-colors rounded-sm flex items-center justify-center gap-2"
        >
          Track Your Order <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

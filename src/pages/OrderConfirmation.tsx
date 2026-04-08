import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId || "SURRIELS-XXXXX";

  return (
    <div className="min-h-[80vh] bg-[#F5F1EB] flex items-center justify-center py-20">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-[#E8DED1] rounded-full flex items-center justify-center mx-auto mb-10"
        >
          <CheckCircle className="w-10 h-10 text-[#111111] stroke-[1.5]" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Thank You</h1>
        <p className="text-[#555555] mb-4 font-light text-lg">Your order has been placed successfully.</p>
        <p className="text-sm font-sans uppercase tracking-widest text-[#111111] mb-12">Order Number: {orderId}</p>
        
        <div className="bg-transparent border border-[#E8DED1] p-8 mb-12">
          <p className="text-sm text-[#555555] mb-2 font-light">You will receive a confirmation on WhatsApp shortly.</p>
          <p className="text-sm text-[#555555] font-light">We will contact you regarding delivery updates.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link 
            to="/shop" 
            className="bg-[#111111] text-[#F5F1EB] px-10 py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#C6A76E] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/track-order" 
            className="border border-[#111111] text-[#111111] px-10 py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#111111] hover:text-[#F5F1EB] transition-colors flex items-center justify-center gap-3"
          >
            Track Your Order <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

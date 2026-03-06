import { motion } from 'framer-motion';
import { ShieldCheck, Clock, RefreshCw } from 'lucide-react';

export default function ReturnPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-serif font-bold mb-8 text-[#1A1A1A]">Return & Refund Policy</h1>

        <div className="bg-[#FAF7F2] p-8 rounded-xl mb-12 border border-[#E5B80B]/20">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Clock className="w-8 h-8 text-[#E5B80B]" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2">2-Day Return Guarantee</h3>
              <p className="text-gray-600">
                We offer a hassle-free 2-day return policy. If you are not completely satisfied with your purchase, 
                you can return it within 2 days of receiving your order for a full refund or exchange.
              </p>
            </div>
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-[#1A1A1A] mb-4">Eligibility for Returns</h2>
            <p>
              To be eligible for a return, your item must be in the same condition that you received it, 
              unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Items must be returned within 2 days of delivery.</li>
              <li>Items must be unworn, unwashed, and in original condition.</li>
              <li>Original tags must be attached.</li>
              <li>Intimates and certain accessories are final sale for hygiene reasons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-[#1A1A1A] mb-4">How to Initiate a Return</h2>
            <p>
              To start a return, you can contact us at <a href="mailto:hello@cenesk.com" className="text-[#B8965A] hover:underline">hello@cenesk.com</a>. 
              If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. 
              Items sent back to us without first requesting a return will not be accepted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-[#1A1A1A] mb-4">Refunds</h2>
            <p>
              We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. 
              If approved, you’ll be automatically refunded on your original payment method within 10 business days. 
              Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6 mt-12 not-prose">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <ShieldCheck className="w-8 h-8 text-[#8A9A5B] mb-4" />
              <h3 className="text-lg font-bold mb-2">Secure Processing</h3>
              <p className="text-sm text-gray-500">All refunds are processed securely through our payment partners.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <RefreshCw className="w-8 h-8 text-[#8A9A5B] mb-4" />
              <h3 className="text-lg font-bold mb-2">Easy Exchanges</h3>
              <p className="text-sm text-gray-500">Need a different size? We make exchanges quick and simple.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

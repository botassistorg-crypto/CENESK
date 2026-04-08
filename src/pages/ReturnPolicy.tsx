import { motion } from 'framer-motion';
import { ShieldCheck, Clock, RefreshCw } from 'lucide-react';

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Return & Refund Policy</h1>
            <div className="w-12 h-[1px] bg-[#111111] mx-auto mb-6"></div>
          </div>

          <div className="bg-transparent p-8 md:p-12 mb-16 border border-[#E8DED1]">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
              <div className="bg-[#E8DED1]/30 p-4 rounded-full">
                <Clock className="w-8 h-8 text-[#111111] stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#111111] mb-3">2-Day Return Guarantee</h3>
                <p className="text-[#555555] font-light text-sm leading-relaxed">
                  We offer a hassle-free 2-day return policy. If you are not completely satisfied with your purchase, 
                  you can return it within 2 days of receiving your order for a full refund or exchange.
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none text-[#555555] font-light text-sm md:text-base leading-relaxed space-y-12">
            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">Eligibility for Returns</h2>
              <p className="mb-4">
                To be eligible for a return, your item must be in the same condition that you received it, 
                unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
              </p>
              <ul className="list-none space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Items must be returned within 2 days of delivery.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Items must be unworn, unwashed, and in original condition.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Original tags must be attached.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Intimates and certain accessories are final sale for hygiene reasons.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">How to Initiate a Return</h2>
              <p>
                To start a return, you can contact us at <a href="mailto:info.surriels@gmail.com" className="text-[#111111] border-b border-[#111111] hover:text-[#C6A76E] hover:border-[#C6A76E] transition-colors pb-0.5">info.surriels@gmail.com</a>. 
                If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. 
                Items sent back to us without first requesting a return will not be accepted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">Refunds</h2>
              <p>
                We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. 
                If approved, you’ll be automatically refunded on your original payment method within 10 business days. 
                Please remember it can take some time for your bank or credit card company to process and post the refund too.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 mt-16 not-prose">
              <div className="bg-transparent p-8 border border-[#E8DED1] text-center md:text-left">
                <ShieldCheck className="w-8 h-8 text-[#111111] stroke-[1.5] mb-6 mx-auto md:mx-0" />
                <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-3 text-[#111111]">Secure Processing</h3>
                <p className="text-sm text-[#555555] font-light">All refunds are processed securely through our payment partners.</p>
              </div>
              <div className="bg-transparent p-8 border border-[#E8DED1] text-center md:text-left">
                <RefreshCw className="w-8 h-8 text-[#111111] stroke-[1.5] mb-6 mx-auto md:mx-0" />
                <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-3 text-[#111111]">Easy Exchanges</h3>
                <p className="text-sm text-[#555555] font-light">Need a different size? We make exchanges quick and simple.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

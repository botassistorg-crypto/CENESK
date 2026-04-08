import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Terms of Service</h1>
            <div className="w-12 h-[1px] bg-[#111111] mx-auto mb-6"></div>
            <p className="text-[#999999] text-[10px] uppercase tracking-[0.2em]">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="prose prose-lg max-w-none text-[#555555] font-light text-sm md:text-base leading-relaxed space-y-12">
            
            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and SURRIELS ("we," "us" or "our"), concerning your access to and use of the SURRIELS website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">2. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, foreign jurisdictions, and international conventions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">3. User Representations</h2>
              <p className="mb-4">
                By using the Site, you represent and warrant that:
              </p>
              <ul className="list-none space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>All registration information you submit will be true, accurate, current, and complete.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>You will maintain the accuracy of such information and promptly update such registration information as necessary.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>You have the legal capacity and you agree to comply with these Terms of Service.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>You are not a minor in the jurisdiction in which you reside.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">4. Products</h2>
              <p>
                We make every effort to display as accurately as possible the colors, features, specifications, and details of the pieces available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">5. Purchases and Payment</h2>
              <p>
                We accept the following forms of payment: bKash, Nagad, and Cash on Delivery. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

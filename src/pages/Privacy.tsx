import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Privacy Policy</h1>
            <div className="w-12 h-[1px] bg-[#111111] mx-auto mb-6"></div>
            <p className="text-[#999999] text-[10px] uppercase tracking-[0.2em]">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="prose prose-lg max-w-none text-[#555555] font-light text-sm md:text-base leading-relaxed space-y-12">
            
            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">1. Introduction</h2>
              <p>
                At SURRIELS, we respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">2. Data We Collect</h2>
              <p className="mb-4">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
              </p>
              <ul className="list-none space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="font-medium text-[#111111]">Identity Data:</strong> includes first name, last name, username or similar identifier.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="font-medium text-[#111111]">Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="font-medium text-[#111111]">Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong className="font-medium text-[#111111]">Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">3. How We Use Your Data</h2>
              <p className="mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-none space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Where we need to perform the contract we are about to enter into or have entered into with you.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#111111] rounded-full mt-2 flex-shrink-0"></span>
                  <span>Where we need to comply with a legal or regulatory obligation.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-6 tracking-wide font-light">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                <br /><br />
                <span className="font-medium text-[#111111]">Email:</span> info.surriels@gmail.com
                <br />
                <span className="font-medium text-[#111111]">Phone:</span> +880 1700-524647
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

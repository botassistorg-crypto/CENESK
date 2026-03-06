import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is your return policy?",
    answer: "We offer a 2-day return policy. If you are not satisfied with your purchase, you can return it within 2 days of delivery for a full refund or exchange, provided the item is in its original condition."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days within the country. International shipping may take 7-14 business days depending on the destination."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location and will be calculated at checkout."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order has shipped, you will receive an email with a tracking number. You can also track your order status on our 'Track Order' page using your order ID and email."
  },
  {
    question: "Are your products sustainable?",
    answer: "We are committed to sustainability. Many of our products are made from eco-friendly materials, and we strive to use sustainable packaging whenever possible."
  },
  {
    question: "How do I care for my garments?",
    answer: "Care instructions vary by product. Please check the care label on each item for specific washing and drying instructions to ensure longevity."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#FAF7F2] rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-[#B8965A]" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500">Everything you need to know about CENESK products and services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={false}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-[#1A1A1A] text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#B8965A]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center bg-[#FAF7F2] p-8 rounded-xl">
          <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2">Still have questions?</h3>
          <p className="text-gray-500 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <a 
            href="/contact" 
            className="inline-block bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#B8965A] transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </motion.div>
    </div>
  );
}

import { AnimatePresence } from 'framer-motion';

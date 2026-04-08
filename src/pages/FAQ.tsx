import { motion, AnimatePresence } from 'framer-motion';
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
    question: "Are your pieces sustainable?",
    answer: "We are committed to sustainability. Many of our pieces are made from eco-friendly materials, and we strive to use sustainable packaging whenever possible."
  },
  {
    question: "How do I care for my garments?",
    answer: "Care instructions vary by piece. Please check the care label on each item for specific washing and drying instructions to ensure longevity."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#F5F1EB] py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Frequently Asked Questions</h1>
            <div className="w-12 h-[1px] bg-[#111111] mx-auto mb-6"></div>
            <p className="text-[#555555] font-light text-sm md:text-base">Everything you need to know about SURRIELS pieces and services.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={false}
                className="border border-[#E8DED1] bg-transparent"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-[#E8DED1]/30 transition-colors"
                >
                  <span className="font-sans text-sm uppercase tracking-widest text-[#111111]">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-4 h-4 text-[#111111] stroke-[1.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#555555] stroke-[1.5]" />
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
                      <div className="px-6 pb-8 text-[#555555] font-light text-sm leading-relaxed border-t border-[#E8DED1] pt-6">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 text-center bg-transparent border border-[#E8DED1] p-12">
            <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#111111] mb-4">Still have questions?</h3>
            <p className="text-[#555555] font-light text-sm mb-8">Can't find the answer you're looking for? Please reach out to our team.</p>
            <a 
              href="/contact" 
              className="inline-block bg-[#111111] text-[#F5F1EB] px-10 py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#C6A76E] transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

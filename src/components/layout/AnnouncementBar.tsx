import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "Free delivery on orders above ৳2,000",
  "Discover the new collection",
  "Timeless elegance, crafted for you"
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111111] h-[36px] flex items-center justify-center overflow-hidden relative z-50">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-[#F5F1EB] text-[10px] uppercase font-sans tracking-[0.2em] font-light"
        >
          {messages[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

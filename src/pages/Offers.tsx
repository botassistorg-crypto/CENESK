import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';

const bundles = [
  {
    id: "bundle-1",
    name: "Date Night Ready",
    items: ["Party Dress", "Gold Necklace Set", "Hair Serum"],
    originalPrice: 3500,
    price: 2499,
    image: "https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg",
    gift: "Surprise self-care item",
    stock: 7
  },
  {
    id: "bundle-2",
    name: "Work Week Essentials",
    items: ["2x Work Dresses", "Work Bag", "Hair Mask"],
    originalPrice: 5200,
    price: 3699,
    image: "https://i.ibb.co.com/mYTmfnZ/flat-lay-hero-1.png",
    gift: "Silk hijab",
    stock: 5
  },
  {
    id: "bundle-3",
    name: "Self-Love Sunday",
    items: ["Comfort Set", "Jade Roller Kit", "Hair Serum", "Scented Items"],
    originalPrice: 3000,
    price: 1999,
    image: "https://i.ibb.co.com/84TJtfdp/SELF-CARE-CATEGORY.png",
    gift: "Surprise intimate set",
    stock: 10
  },
  {
    id: "bundle-4",
    name: "Complete Makeover Box",
    items: ["Dress", "Accessories Set", "Hair Products", "Self-Care Kit"],
    originalPrice: 6500,
    price: 4299,
    image: "https://i.ibb.co.com/sv5Q2S5f/Brand-Mood-4.png",
    gift: "Premium surprise box",
    stock: 3
  }
];

export default function Offers() {
  const { addItem } = useCart();

  const handleAddToCart = (bundle: any) => {
    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.price,
      image: bundle.image,
      quantity: 1
    });
    toast.success("Bundle added to cart!");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden bg-black flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg')] bg-cover bg-center opacity-60"></div>
        <div className="relative z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-white mb-4 tracking-wide"
          >
            Curated Bundles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-200 font-light tracking-wider uppercase"
          >
            Save more when you shop smart
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                  Save {formatPrice(bundle.originalPrice - bundle.price)}
                </div>
                {bundle.stock < 5 && (
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Only {bundle.stock} left
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-2">{bundle.name}</h3>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-[#B8965A]">{formatPrice(bundle.price)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(bundle.originalPrice)}</span>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">What's Included:</h4>
                  <ul className="space-y-2">
                    {bundle.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 bg-[#B8965A] rounded-full"></span>
                        {item}
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-[#B8965A] font-medium">
                      <Gift className="w-4 h-4" />
                      FREE Gift: {bundle.gift}
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleAddToCart(bundle)}
                  className="w-full bg-[#1A1A1A] text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#B8965A] transition-all rounded-sm flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" /> Grab This Bundle
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

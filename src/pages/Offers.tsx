import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';
import { getBundles } from '../lib/api';

export default function Offers() {
  const { addItem } = useCart();
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const data = await getBundles();
        const mappedBundles = (Array.isArray(data) ? data : [])
          .filter((b: any) => b.Status === 'Active')
          .map((b: any) => ({
            id: b.ID,
            name: b.Name,
            items: b.Items ? b.Items.split(',').map((i: string) => i.trim()) : [],
            originalPrice: Number(b.OriginalPrice),
            price: b.SalePrice ? Number(b.SalePrice) : Number(b.OriginalPrice),
            image: b.Images ? b.Images.split(',')[0].trim() : '',
            gift: "Surprise Gift", // Default gift as it's not in API yet
            stock: Number(b.Stock)
          }));
        setBundles(mappedBundles);
      } catch (error) {
        console.error("Failed to fetch bundles", error);
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchBundles();
  }, []);

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm h-96 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-8 space-y-4">
                  <div className="h-8 bg-gray-200 w-3/4"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif text-gray-400">No active offers at the moment.</h2>
            <p className="text-gray-500 mt-2">Check back later for exclusive bundles!</p>
          </div>
        ) : (
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
                  <img 
                    src={bundle.image || "https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg"} 
                    alt={bundle.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg'; }}
                  />
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
                      {bundle.items.map((item: string, i: number) => (
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
        )}
      </div>
    </div>
  );
}

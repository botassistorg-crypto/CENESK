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
    <div className="min-h-screen bg-[#F5F1EB] pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-[#111111]/40"></div>
        <div className="relative z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-[#F5F1EB] mb-6 tracking-[0.1em] font-light"
          >
            Curated Bundles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs md:text-sm text-[#E8DED1] font-light tracking-[0.2em] uppercase"
          >
            Save more when you shop smart
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24 md:py-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-transparent border border-[#E8DED1] h-[500px] animate-pulse">
                <div className="h-64 bg-[#E8DED1]/50"></div>
                <div className="p-10 space-y-6">
                  <div className="h-8 bg-[#E8DED1]/50 w-3/4"></div>
                  <div className="h-4 bg-[#E8DED1]/50 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-24 border border-[#E8DED1] bg-transparent">
            <h2 className="text-2xl font-serif text-[#555555] font-light tracking-wide">No active offers at the moment.</h2>
            <p className="text-[#999999] mt-4 font-light text-sm">Check back later for exclusive bundles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {bundles.map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-transparent border border-[#E8DED1] group hover:border-[#111111] transition-colors duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={bundle.image || "https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg"} 
                    alt={bundle.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg'; }}
                  />
                  <div className="absolute top-6 right-6 bg-[#111111] text-[#F5F1EB] px-4 py-2 text-[10px] uppercase tracking-[0.2em]">
                    Save {formatPrice(bundle.originalPrice - bundle.price)}
                  </div>
                  {bundle.stock < 5 && (
                    <div className="absolute bottom-6 left-6 bg-[#C6A76E] text-[#111111] px-4 py-2 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clock className="w-3 h-3 stroke-[1.5]" /> Only {bundle.stock} left
                    </div>
                  )}
                </div>
                
                <div className="p-10">
                  <h3 className="text-2xl font-serif text-[#111111] mb-4 tracking-wide font-light">{bundle.name}</h3>
                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="text-2xl font-sans font-light text-[#111111]">{formatPrice(bundle.price)}</span>
                    <span className="text-sm text-[#999999] line-through font-light">{formatPrice(bundle.originalPrice)}</span>
                  </div>

                  <div className="space-y-6 mb-10">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#999999]">What's Included:</h4>
                    <ul className="space-y-3">
                      {bundle.items.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-[#555555] font-light text-sm">
                          <span className="w-1 h-1 bg-[#111111] rounded-full"></span>
                          {item}
                        </li>
                      ))}
                      <li className="flex items-center gap-3 text-[#C6A76E] font-light text-sm">
                        <Gift className="w-4 h-4 stroke-[1.5]" />
                        FREE Gift: {bundle.gift}
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleAddToCart(bundle)}
                    className="w-full bg-transparent border border-[#111111] text-[#111111] py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#111111] hover:text-[#F5F1EB] transition-colors flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" /> Grab This Bundle
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

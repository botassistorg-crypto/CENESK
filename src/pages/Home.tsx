import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { getProducts } from '../lib/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();

        const mappedProducts = (Array.isArray(productsData) ? productsData : [])
          .filter((p: any) => p.Featured === 'Yes' || p.Status === 'Active')
          .slice(0, 4)
          .map((p: any) => ({
            id: p.ID,
            name: p.Name,
            category: p.Category,
            price: Number(p.OriginalPrice),
            salePrice: p.SalePrice ? Number(p.SalePrice) : undefined,
            image: p.Images ? p.Images.split(',')[0].trim() : '',
            rating: 5,
            reviews: 0,
            badge: p.Featured === 'Yes' ? 'Featured' : (p.SalePrice ? 'Sale' : '')
          }));
        
        setFeaturedProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#F5F1EB] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(https://i.ibb.co.com/qFj5zx56/1775562939200-019d67ca-9571-78e2-8fdf-6b71e086c0c0.png)` }}
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-4 tracking-[0.2em] font-light"
          >
            SURRIELS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-sm md:text-base text-white/90 tracking-[0.3em] uppercase font-sans"
          >
            Timeless Elegance
          </motion.p>
        </div>
      </section>

      {/* 2. AFTER HERO (First Scroll Section) */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(https://i.ibb.co.com/JWV45sS8/1775562672369-019d67c7-22d5-721a-a777-208351d410f2.png)` }}
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-serif text-white tracking-[0.15em] font-light"
          >
            Crafted in Detail
          </motion.h2>
        </div>
      </section>

      {/* 3. MID HOMEPAGE (Lifestyle Section) */}
      <section className="py-24 md:py-32 px-4 container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 aspect-[3/4] md:aspect-[4/5] overflow-hidden"
          >
            <img 
              src="https://i.ibb.co.com/7HQ1yNR/1775562781701-019d67c9-63e8-7855-b943-e5645bcad6ad.png" 
              alt="Lifestyle" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 text-center md:text-left space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-[#111111] leading-tight tracking-wide font-light">
              Redefining <br /> Modest Luxury
            </h2>
            <p className="text-[#555555] text-lg font-light leading-relaxed max-w-md mx-auto md:mx-0">
              Discover a collection where sophisticated design meets uncompromising quality. Every piece is a testament to the art of subtle elegance.
            </p>
            <Link 
              to="/shop" 
              className="inline-block border-b border-[#111111] pb-1 text-[#111111] uppercase tracking-[0.2em] text-sm hover:text-[#C6A76E] hover:border-[#C6A76E] transition-colors"
            >
              Discover the Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. BETWEEN PRODUCT SECTIONS (Detail Shot) */}
      <section className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(https://i.ibb.co.com/Q7M3fpBb/1775562947424-019d67cb-3057-7440-bd1b-fca91593114f.jpg)` }}
        />
      </section>

      {/* Featured Products */}
      <section 
        className="py-24 md:py-32 px-4 relative"
        style={{ backgroundImage: `url(https://i.ibb.co.com/HfzwwLck/1775563786682-019d67d9-1e12-7f61-8125-2899d7d1649e.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#F5F1EB]/80" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#111111] tracking-[0.1em] font-light mb-4">Curated Selection</h2>
            <Link to="/shop" className="text-[#555555] text-sm uppercase tracking-[0.2em] hover:text-[#C6A76E] transition-colors">
              View All Pieces
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#E8DED1] aspect-[3/4] mb-4"></div>
                  <div className="h-4 bg-[#E8DED1] w-3/4 mb-2 mx-auto"></div>
                  <div className="h-4 bg-[#E8DED1] w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-4 text-center py-12 text-[#555555]">
                  <p>No featured pieces available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 6. FOOTER / LAST SECTION (Brand Ending) */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(https://i.ibb.co.com/WW6c3mKR/1775568527863-019d6820-fb7e-7579-9917-57c379fe8658.png)` }}
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-serif text-white tracking-[0.2em] font-light mb-4"
          >
            SURRIELS
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-sm text-white/80 tracking-[0.3em] uppercase font-sans"
          >
            Timeless Elegance
          </motion.p>
        </div>
      </section>
    </div>
  );
}

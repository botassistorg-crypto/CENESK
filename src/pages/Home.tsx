import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, MessageCircle, RefreshCw, Star, Quote } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import { getProducts, getBundles } from '../lib/api';

const heroSlides = [
  {
    id: 1,
    image: "https://i.ibb.co.com/23ZC6FCj/Abstract-Luxury-3.png",
    title: "CENESK",
    subtitle: "Curated For You",
    buttonText: "Explore Collection",
    link: "/shop"
  },
  {
    id: 2,
    image: "https://i.ibb.co.com/60KdpxTR/Shopping-Bag-Brand-4.png",
    title: "New Season. New Style.",
    subtitle: "Discover the latest trends",
    buttonText: "Shop Now",
    link: "/shop"
  },
  {
    id: 3,
    image: "https://i.ibb.co.com/zWw4gLqg/manequin-hero-2.png",
    title: "Elegance Defined",
    subtitle: "Timeless pieces for every occasion",
    buttonText: "View Collection",
    link: "/shop"
  },
  {
    id: 4,
    image: "https://i.ibb.co.com/sv5Q2S5f/Brand-Mood-4.png",
    title: "Luxury You Deserve",
    subtitle: "Premium quality, affordable prices",
    buttonText: "Discover More",
    link: "/shop"
  },
  {
    id: 5,
    image: "https://i.ibb.co.com/mYTmfnZ/flat-lay-hero-1.png",
    title: "Style Meets Comfort",
    subtitle: "Look good, feel better",
    buttonText: "Shop Bundles",
    link: "/offers"
  }
];

const categories = [
  { name: "Clothing", image: "https://i.ibb.co.com/Y7ZyQ016/clothing-category.png", link: "/shop/clothing" },
  { name: "Intimates", image: "https://i.ibb.co.com/Qvb3NhR9/intimate-category.jpg", link: "/shop/intimates" },
  { name: "Hair Products", image: "https://i.ibb.co.com/BVm371Bc/hair-care-category.png", link: "/shop/hair-products" },
  { name: "Accessories", image: "https://i.ibb.co.com/60jJ3YqC/accessories-category.jpg", link: "/shop/accessories" },
  { name: "Self Care", image: "https://i.ibb.co.com/84TJtfdp/SELF-CARE-CATEGORY.png", link: "/shop/self-care" },
  { name: "Bundles & Offers", image: "https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg", link: "/offers" }
];

const features = [
  { icon: Truck, title: "Nationwide Delivery", description: "We deliver across all of Bangladesh" },
  { icon: ShieldCheck, title: "Curated Quality", description: "Every product is handpicked and tested" },
  { icon: MessageCircle, title: "24/7 Support", description: "Always here for you on WhatsApp" },
  { icon: RefreshCw, title: "Easy Returns", description: "Hassle-free return within 2 days" }
];

const testimonials = [
  {
    quote: "The quality of the Elegant Noir Abaya exceeded my expectations. Truly a piece of art that feels as good as it looks.",
    author: "Sarah Ahmed",
    role: "Verified Customer"
  },
  {
    quote: "CENESK has become my go-to for hair care. The Argan Gold serum is a game changer for my daily routine.",
    author: "Nabila Rahman",
    role: "Loyal Customer"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredBundles, setFeaturedBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, bundlesData] = await Promise.all([
          getProducts(),
          getBundles()
        ]);

        // Map API products to ProductCard format
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

        // Get first 2 bundles
        const mappedBundles = (Array.isArray(bundlesData) ? bundlesData : [])
          .slice(0, 2)
          .map((b: any) => ({
            id: b.ID,
            name: b.Name,
            description: b.Description,
            image: b.Images ? b.Images.split(',')[0].trim() : '',
            link: '/offers'
          }));
          
        setFeaturedBundles(mappedBundles);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 tracking-wide drop-shadow-lg"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-lg md:text-xl text-gray-200 mb-10 font-light tracking-wider uppercase drop-shadow-md"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Link
                  to={heroSlides[currentSlide].link}
                  className="bg-[#B8965A] text-white px-10 py-4 uppercase tracking-widest text-sm font-medium hover:bg-[#9A7D4B] transition-all duration-300 hover:scale-105 inline-block shadow-lg"
                >
                  {heroSlides[currentSlide].buttonText}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-[#B8965A] w-8' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Curated Selection (Magazine Style) */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl"
          >
            <img 
              src="https://i.ibb.co.com/zWw4gLqg/manequin-hero-2.png" 
              alt="Curated Collection" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <span className="text-[#B8965A] uppercase tracking-[0.3em] text-sm font-semibold">The Season's Best</span>
            <h2 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] leading-tight">The Curated <br /> Collection</h2>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Discover our handpicked selection of timeless pieces designed to elevate your everyday elegance. 
              Each item in this collection has been chosen for its exceptional quality and unique design.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-[#B8965A]" />
                <span className="text-sm uppercase tracking-widest font-medium">Premium Materials</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-[#B8965A]" />
                <span className="text-sm uppercase tracking-widest font-medium">Artisanal Craftsmanship</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-[#B8965A]" />
                <span className="text-sm uppercase tracking-widest font-medium">Timeless Aesthetic</span>
              </div>
            </div>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-3 text-[#1A1A1A] font-bold uppercase tracking-widest text-sm group"
            >
              Explore Now 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Bundles */}
      {featuredBundles.length > 0 && (
        <section className="bg-[#1A1A1A] py-24 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <span className="text-[#B8965A] uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Exclusive Value</span>
                <h2 className="text-4xl md:text-5xl font-serif mb-6">Curated Bundles</h2>
                <p className="text-gray-400 font-light text-lg">
                  Save more with our expertly paired sets. Designed to provide a complete experience at an exceptional price.
                </p>
              </div>
              <Link to="/offers" className="bg-white text-[#1A1A1A] px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-[#B8965A] hover:text-white transition-all duration-300">
                View All Offers
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredBundles.map((bundle, index) => (
                <div key={index} className="group relative aspect-[16/9] overflow-hidden rounded-2xl">
                  <img 
                    src={bundle.image || "https://i.ibb.co.com/GQHWjX8J/BUNDLES-CATEGORY.jpg"} 
                    alt={bundle.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-center p-12">
                    <h3 className="text-3xl font-serif mb-4">{bundle.name}</h3>
                    <p className="text-gray-200 mb-8 max-w-xs font-light">{bundle.description}</p>
                    <Link to="/offers" className="text-white border-b border-white w-fit pb-1 text-sm uppercase tracking-widest font-bold hover:text-[#B8965A] hover:border-[#B8965A] transition-colors">
                      Shop Bundle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif text-[#1A1A1A] mb-2">Featured Picks</h2>
            <p className="text-gray-500">Our most loved items this month</p>
          </div>
          <Link to="/shop" className="text-[#B8965A] hover:underline flex items-center gap-2 font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
              <div className="col-span-4 text-center py-12 text-gray-400">
                <p>No featured products found.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-[#1A1A1A]">Shop By Category</h2>
          <p className="text-gray-500 font-light text-lg">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link 
              to={category.link} 
              key={index} 
              className="group relative overflow-hidden rounded-xl aspect-square block shadow-md hover:shadow-xl transition-shadow duration-500"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-full p-8 text-center transform transition-transform duration-500">
                <h3 className="text-3xl font-serif text-white mb-3">{category.name}</h3>
                <span className="text-[#B8965A] text-sm uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-2">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-[#FAF7F2] py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <Quote className="w-96 h-96 -translate-x-24 -translate-y-24" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#E5B80B] text-[#E5B80B]" />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide % testimonials.length}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-3xl md:text-4xl font-serif text-[#1A1A1A] leading-relaxed italic mb-10">
                "{testimonials[currentSlide % testimonials.length].quote}"
              </p>
              <div>
                <h4 className="text-lg font-bold text-[#1A1A1A] tracking-widest uppercase mb-1">
                  {testimonials[currentSlide % testimonials.length].author}
                </h4>
                <p className="text-[#B8965A] text-sm uppercase tracking-widest font-medium">
                  {testimonials[currentSlide % testimonials.length].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#B8965A]/10 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-[#1A1A1A] group-hover:text-[#B8965A] transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-serif font-bold mb-2 text-[#1A1A1A]">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section (Minimalist) */}
      <section className="container mx-auto px-4 py-24 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[#B8965A] uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Join the Circle</span>
          <h2 className="text-4xl font-serif text-[#1A1A1A] mb-6">Stay Inspired</h2>
          <p className="text-gray-500 mb-10 font-light">
            Be the first to know about new collections, private events, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 border-b border-gray-200 focus:border-[#B8965A] focus:outline-none transition-colors bg-transparent"
            />
            <button
              type="submit"
              className="bg-[#1A1A1A] text-white px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#B8965A] transition-colors duration-300"
            >
              Join Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

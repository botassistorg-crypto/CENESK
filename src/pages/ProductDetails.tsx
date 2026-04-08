import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Truck, RefreshCw, ShieldCheck, Minus, Plus, Share2, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { getProducts } from '../lib/api';
import { toast } from 'sonner';
import { ProductCard } from '../components/ui/ProductCard';
import Skeleton from '../components/ui/Skeleton';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const productsData = await getProducts();
        
        // Map API products to internal format
        const mappedProducts = (Array.isArray(productsData) ? productsData : []).map((p: any) => ({
          id: p.ID,
          name: p.Name,
          category: p.Category,
          price: Number(p.OriginalPrice),
          salePrice: p.SalePrice ? Number(p.SalePrice) : undefined,
          image: p.Images ? p.Images.split(',')[0].trim() : '',
          images: p.Images ? p.Images.split(',').map((img: string) => img.trim()) : [],
          description: p.Description,
          sizes: p.Sizes ? p.Sizes.split(',').map((s: string) => s.trim()) : [],
          colors: p.Colors ? p.Colors.split(',').map((c: string) => c.trim()) : [],
          rating: 5, // Default
          reviews: 0, // Default
          badge: p.Featured === 'Yes' ? 'Featured' : (p.SalePrice ? 'Sale' : '')
        }));

        setAllProducts(mappedProducts);

        const foundProduct = mappedProducts.find((p: any) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          // Set default selections
          if (foundProduct.sizes.length > 0) setSelectedSize(foundProduct.sizes[0]);
          if (foundProduct.colors.length > 0) setSelectedColor(foundProduct.colors[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 bg-[#F5F1EB]">
        <div className="flex flex-col lg:flex-row gap-16">
          <Skeleton className="lg:w-1/2 aspect-[3/4]" />
          <div className="lg:w-1/2 space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      quantity,
      size: selectedSize,
      color: selectedColor
    });
    toast.success("Added to cart!");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-[#F5F1EB] min-h-screen">
      <div className="flex flex-col lg:flex-row gap-16 mb-32">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div 
            className="aspect-[3/4] bg-[#E8DED1] overflow-hidden mb-6 relative cursor-zoom-in"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${showZoom ? 'scale-150' : 'scale-100'}`}
              style={showZoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
            />
            {product.badge && (
              <span className="absolute top-6 left-6 bg-[#111111] text-[#F5F1EB] text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 z-10 font-light">
                {product.badge}
              </span>
            )}
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-6 right-6 z-10 p-3 text-[#111111] hover:text-[#C6A76E] transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#C6A76E] text-[#C6A76E]' : 'stroke-[1.5]'}`} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {product.images.slice(0, 4).map((img: string, i: number) => (
              <div key={i} className="aspect-[3/4] bg-[#E8DED1] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-12">
          <div>
            <nav className="text-xs font-sans tracking-[0.2em] uppercase text-[#999999] mb-6">
              <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link> / <Link to="/shop" className="hover:text-[#111111] transition-colors">Shop</Link> / <span className="text-[#111111]">{product.name}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">{product.name}</h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-[#C6A76E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-[#E8DED1]'}`} />
                ))}
              </div>
              <span className="text-xs text-[#999999] font-light tracking-widest uppercase">({product.reviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-6">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-light text-[#111111]">{formatPrice(product.salePrice)}</span>
                  <span className="text-lg text-[#999999] line-through font-light">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="text-2xl font-light text-[#111111]">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>

          <p className="text-[#555555] leading-relaxed font-light text-sm md:text-base">
            {product.description || `Experience luxury with our ${product.name}. Crafted with premium materials and designed for elegance, this piece is a perfect addition to your collection.`}
          </p>

          <div className="space-y-10">
            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#111111]">Size</h3>
                  <Link to="/size-guide" className="text-[10px] uppercase tracking-[0.2em] text-[#999999] border-b border-[#999999] pb-0.5 hover:text-[#111111] hover:border-[#111111] transition-colors">Size Guide</Link>
                </div>
                <div className="flex gap-4">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center text-xs font-light transition-all ${
                        selectedSize === size
                          ? 'border border-[#111111] text-[#111111]'
                          : 'border border-transparent text-[#999999] hover:text-[#111111]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-4 text-[#111111]">Color</h3>
                <div className="flex gap-4">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border transition-all ${
                        selectedColor === color ? 'border-[#111111] scale-110' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() === 'gold' ? '#C6A76E' : color.toLowerCase() === 'sage' ? '#A8B5A0' : (color.toLowerCase() === 'white' ? '#f0f0f0' : color.toLowerCase()) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-[#E8DED1]">
              <div className="flex items-center border-b border-[#111111] w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:opacity-70 transition-opacity"
                >
                  <Minus className="w-4 h-4 text-[#111111]" />
                </button>
                <span className="w-12 text-center font-light text-[#111111]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:opacity-70 transition-opacity"
                >
                  <Plus className="w-4 h-4 text-[#111111]" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#111111] text-[#F5F1EB] px-8 py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#C6A76E] transition-colors"
              >
                Add to Cart
              </button>
              
              <button className="p-4 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F5F1EB] transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <a 
              href={`https://wa.me/8801700524647?text=Hi, I'm interested in ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center border border-[#333333] text-[#555555] px-8 py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#111111] hover:text-[#F5F1EB] transition-colors"
            >
              Order via WhatsApp
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-[#E8DED1]">
            <div className="flex flex-col items-center text-center gap-3">
              <Truck className="w-5 h-5 text-[#C6A76E] stroke-[1.5]" />
              <span className="text-[10px] text-[#555555] uppercase tracking-[0.2em] font-light">Free delivery over ৳2,000</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#C6A76E] stroke-[1.5]" />
              <span className="text-[10px] text-[#555555] uppercase tracking-[0.2em] font-light">2-day easy returns</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C6A76E] stroke-[1.5]" />
              <span className="text-[10px] text-[#555555] uppercase tracking-[0.2em] font-light">Authentic pieces</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E8DED1] pt-32">
          <h2 className="text-3xl font-serif text-[#111111] mb-16 text-center tracking-[0.1em] font-light">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

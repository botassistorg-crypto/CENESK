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
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
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
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12 mb-24">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div 
            className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative cursor-zoom-in"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-200 ${showZoom ? 'scale-150' : 'scale-100'}`}
              style={showZoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-bold px-3 py-1 z-10">
                {product.badge}
              </span>
            )}
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm text-[#1A1A1A] hover:text-[#B8965A] transition-colors shadow-sm"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#E5B80B] text-[#E5B80B]' : ''}`} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(0, 4).map((img: string, i: number) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-8">
          <div>
            <nav className="text-sm text-gray-500 mb-4">
              <Link to="/" className="hover:text-[#B8965A]">Home</Link> / <Link to="/shop" className="hover:text-[#B8965A]">Shop</Link> / <span className="text-[#1A1A1A]">{product.name}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex text-[#E5B80B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews} verified reviews)</span>
            </div>
            <div className="flex items-baseline gap-4">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-[#1A1A1A]">{formatPrice(product.salePrice)}</span>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="text-green-600 text-sm font-medium">Save {formatPrice(product.price - product.salePrice)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-[#1A1A1A]">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed font-light text-lg">
            {product.description || `Experience luxury with our ${product.name}. Crafted with premium materials and designed for elegance, this piece is a perfect addition to your collection.`}
          </p>

          <div className="space-y-6">
            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Size</h3>
                  <Link to="/size-guide" className="text-xs text-[#B8965A] hover:underline">Size Guide</Link>
                </div>
                <div className="flex gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-[#B8965A] bg-[#B8965A] text-white'
                          : 'border-gray-200 hover:border-[#B8965A] text-gray-600'
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
                <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color ? 'border-[#B8965A] scale-110' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() === 'gold' ? '#B8965A' : color.toLowerCase() === 'sage' ? '#A8B5A0' : (color.toLowerCase() === 'white' ? '#f0f0f0' : color.toLowerCase()) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#1A1A1A] text-white px-8 py-3 rounded-lg uppercase tracking-widest text-sm font-bold hover:bg-[#B8965A] transition-all hover:shadow-lg active:scale-95"
              >
                Add to Cart
              </button>
              
              <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <a 
              href={`https://wa.me/8801700524647?text=Hi, I'm interested in ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#25D366]/10 text-[#25D366] px-8 py-3 rounded-lg uppercase tracking-widest text-sm font-bold hover:bg-[#25D366] hover:text-white transition-all"
            >
              Order via WhatsApp
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#B8965A]" />
              <span className="text-xs text-gray-600 uppercase tracking-wider">Free delivery over ৳2,000</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#B8965A]" />
              <span className="text-xs text-gray-600 uppercase tracking-wider">2-day easy returns</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#B8965A]" />
              <span className="text-xs text-gray-600 uppercase tracking-wider">Authentic products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-100 pt-24">
          <h2 className="text-3xl font-serif text-[#1A1A1A] mb-12 text-center">You May Also Like</h2>
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

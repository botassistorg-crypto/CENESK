import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      quantity: 1
    });
    toast.success("Added to cart!");
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link to={`/shop/product/${product.id}`} className="group block relative">
      <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-100 mb-4">
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 z-10">
            {product.badge}
          </span>
        )}
        
        <button 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[#1A1A1A] hover:text-[#B8965A] transition-colors shadow-sm"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#E5B80B] text-[#E5B80B]' : ''}`} />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="bg-white text-[#1A1A1A] p-3 rounded-full shadow-lg hover:bg-[#B8965A] hover:text-white transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white text-[#1A1A1A] p-3 rounded-full shadow-lg hover:bg-[#B8965A] hover:text-white transition-colors"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-start mb-1">
          <p className="text-[#B8965A] text-[10px] uppercase tracking-widest font-medium">{product.category}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#E5B80B] text-[#E5B80B]" />
            <span className="text-[10px] text-gray-500 font-medium">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-serif font-medium text-[#1A1A1A] mb-1 group-hover:text-[#B8965A] transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-[#1A1A1A] font-bold">{formatPrice(product.salePrice)}</span>
              <span className="text-gray-400 text-sm line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-[#1A1A1A] font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

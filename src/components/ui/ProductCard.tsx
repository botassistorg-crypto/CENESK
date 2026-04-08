import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
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
      <div className="relative overflow-hidden aspect-[3/4] bg-[#E8DED1] mb-6">
        {product.badge && (
          <span className="absolute top-4 left-4 bg-[#111111] text-[#F5F1EB] text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 z-10 font-light">
            {product.badge}
          </span>
        )}
        
        <button 
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-10 p-2 text-[#111111] hover:text-[#C6A76E] transition-colors"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#C6A76E] text-[#C6A76E]' : 'stroke-[1.5]'}`} />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-[#F5F1EB] text-[#111111] w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#111111] hover:text-[#F5F1EB] transition-colors"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#F5F1EB] text-[#111111] w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#111111] hover:text-[#F5F1EB] transition-colors"
          >
            <Eye className="w-4 h-4 stroke-[1.5]" />
          </motion.button>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-sm font-sans uppercase tracking-[0.15em] text-[#111111] mb-2 font-light">{product.name}</h3>
        <div className="flex items-center justify-center gap-3">
          {product.salePrice ? (
            <>
              <span className="text-[#111111] text-sm font-light">{formatPrice(product.salePrice)}</span>
              <span className="text-[#999999] text-xs line-through font-light">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-[#111111] text-sm font-light">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

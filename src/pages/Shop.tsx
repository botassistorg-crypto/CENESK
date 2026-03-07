import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Search, Loader2 } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { getProducts, getCategories } from '../lib/api';

const sortOptions = ["Newest First", "Price: Low to High", "Price: High to Low", "Most Popular"];

export default function Shop() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Products"]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("Newest First");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        // Transform API products to match UI expected format
        const formattedProducts = productsData.map((p: any) => ({
          id: p.ID,
          name: p.Name,
          category: p.Category,
          price: Number(p.OriginalPrice),
          salePrice: Number(p.SalePrice) || null,
          image: p.Images.split(',')[0],
          description: p.Description,
          rating: 4.5, // Default or fetch reviews later
          reviews: 10,
          badge: p.Featured === 'Yes' ? 'Featured' : null
        }));

        setProducts(formattedProducts);
        
        // Extract categories from API or use defaults
        const categoryNames = ["All Products", ...categoriesData.map((c: any) => c.Name)];
        if (categoryNames.length === 1) {
             // Fallback if no categories in DB yet
             setCategories(["All Products", "Clothing", "Intimates", "Hair Products", "Accessories", "Self Care", "Bundles & Offers"]);
        } else {
             setCategories(categoryNames);
        }

      } catch (error) {
        console.error("Failed to load shop data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (category) {
      // Convert slug to category name (e.g., "hair-products" -> "Hair Products")
      const categoryName = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      // Handle special cases if needed, or just find the closest match
      const matchedCategory = categories.find(c => c.toLowerCase() === categoryName.toLowerCase());
      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
      } else if (category === "bundles") {
        setSelectedCategory("Bundles & Offers");
      }
    } else {
      setSelectedCategory("All Products");
    }
    setCurrentPage(1); // Reset to page 1 when category changes
  }, [category, categories]);

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return products
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (product as any).description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Most Popular") return b.reviews - a.reviews;
      return 0; // Default to original order (Newest)
    });
  }, [selectedCategory, priceRange, sortBy, searchQuery, products]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, sortBy, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8965A]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-serif text-[#1A1A1A]">Our Collection</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products or descriptions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A] transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Auto-suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden"
                >
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSearchQuery(p.name);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category}</p>
                      </div>
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowSuggestions(false)}
                    className="w-full py-2 text-xs text-center text-gray-400 bg-gray-50 hover:text-[#B8965A]"
                  >
                    Close Suggestions
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            className="md:hidden p-2 border border-gray-200 rounded-lg"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-lg font-serif font-bold mb-4 text-[#1A1A1A]">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`text-sm hover:text-[#B8965A] transition-colors text-left w-full ${
                        selectedCategory === category ? 'text-[#B8965A] font-medium' : 'text-gray-500'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold mb-4 text-[#1A1A1A]">Price Range</h3>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-[#B8965A]"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>৳0</span>
                <span>৳{priceRange[1]}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold mb-4 text-[#1A1A1A]">Sort By</h3>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-[#B8965A]"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Mobile/Desktop Category Pills */}
          <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex gap-3 w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-[#1A1A1A] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">Showing {paginatedProducts.length} of {filteredProducts.length} products</p>
          
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* @ts-ignore */}
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#B8965A] hover:text-[#B8965A] transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-[#1A1A1A] text-white'
                          : 'border border-gray-200 hover:border-[#B8965A] hover:text-[#B8965A]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#B8965A] hover:text-[#B8965A] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategory("All Products");
                  setSearchQuery("");
                  setPriceRange([0, 10000]);
                }}
                className="mt-4 text-[#B8965A] hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

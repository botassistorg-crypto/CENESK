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
  const [categories, setCategories] = useState<string[]>(["All Pieces"]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState("All Pieces");
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
        const categoryNames = ["All Pieces", ...categoriesData.map((c: any) => c.Name)];
        if (categoryNames.length === 1) {
             // Fallback if no categories in DB yet
             setCategories(["All Pieces", "Clothing", "Intimates", "Hair Products", "Accessories", "Self Care", "Bundles & Offers"]);
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
      setSelectedCategory("All Pieces");
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
      const matchesCategory = selectedCategory === "All Pieces" || product.category === selectedCategory;
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
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1EB]">
        <Loader2 className="w-8 h-8 animate-spin text-[#111111]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-[#F5F1EB] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <h1 className="text-4xl md:text-5xl font-serif text-[#111111] tracking-[0.1em] font-light">Our Collection</h1>
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-[#111111] text-sm focus:outline-none focus:border-[#C6A76E] placeholder-[#999999] font-light transition-colors text-[#111111]"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]" />
            </div>

            {/* Auto-suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-2 bg-[#F5F1EB] border border-[#E8DED1] shadow-2xl overflow-hidden"
                >
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSearchQuery(p.name);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#E8DED1] flex items-center gap-4 transition-colors border-b border-[#E8DED1] last:border-0"
                    >
                      <img src={p.image} alt={p.name} className="w-12 h-16 object-cover" />
                      <div>
                        <p className="text-sm font-sans tracking-[0.1em] text-[#111111] uppercase">{p.name}</p>
                        <p className="text-xs text-[#999999] tracking-widest uppercase mt-1">{p.category}</p>
                      </div>
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowSuggestions(false)}
                    className="w-full py-3 text-[10px] uppercase tracking-[0.2em] text-[#555555] bg-[#E8DED1] hover:text-[#111111] transition-colors"
                  >
                    Close Suggestions
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            className="md:hidden p-2 text-[#111111]"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Sidebar Filters */}
        <aside className={`md:w-56 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-32 space-y-12">
            <div>
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-6 text-[#111111]">Categories</h3>
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`text-sm tracking-wide transition-colors text-left w-full font-light ${
                        selectedCategory === category ? 'text-[#C6A76E]' : 'text-[#555555] hover:text-[#111111]'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-6 text-[#111111]">Price Range</h3>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-[#111111]"
              />
              <div className="flex justify-between text-xs text-[#999999] mt-4 font-light tracking-widest">
                <span>৳0</span>
                <span>৳{priceRange[1]}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-6 text-[#111111]">Sort By</h3>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-transparent border-b border-[#111111] px-0 py-2 text-sm focus:outline-none focus:border-[#C6A76E] font-light text-[#555555]"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#F5F1EB]">{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111] pointer-events-none" />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Mobile/Desktop Category Pills */}
          <div className="mb-12 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex gap-6 w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs uppercase tracking-[0.2em] pb-1 border-b transition-all ${
                    selectedCategory === category
                      ? 'border-[#111111] text-[#111111]'
                      : 'border-transparent text-[#999999] hover:text-[#111111]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#999999] mb-8 tracking-[0.1em] uppercase">Showing {paginatedProducts.length} of {filteredProducts.length} pieces</p>
          
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* @ts-ignore */}
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-24 gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-xs uppercase tracking-[0.2em] text-[#555555] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#111111] transition-colors"
                  >
                    Prev
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-light transition-colors ${
                          currentPage === page
                            ? 'text-[#111111] border-b border-[#111111]'
                            : 'text-[#999999] hover:text-[#111111]'
                        }`}
                      >
                        {page}
                    </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-xs uppercase tracking-[0.2em] text-[#555555] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#111111] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32">
              <p className="text-[#555555] text-lg font-light tracking-wide">No pieces found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategory("All Pieces");
                  setSearchQuery("");
                  setPriceRange([0, 10000]);
                }}
                className="mt-8 text-xs uppercase tracking-[0.2em] text-[#111111] border-b border-[#111111] pb-1 hover:text-[#C6A76E] hover:border-[#C6A76E] transition-colors"
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

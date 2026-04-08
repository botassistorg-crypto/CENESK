import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import Logo from '../ui/Logo';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, toggleCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Bundles & Offers', path: '/offers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-[36px] left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? 'bg-[#F5F1EB]/95 backdrop-blur-md shadow-sm py-4' : 'bg-[#F5F1EB] py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-[#111111]" />
          </button>
          <Logo className="text-2xl lg:text-3xl text-[#111111]" />
        </div>

        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xs font-sans tracking-[0.2em] uppercase relative group ${
                location.pathname === link.path ? 'text-[#C6A76E]' : 'text-[#555555] hover:text-[#111111]'
              } transition-colors duration-300`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-0 w-0 h-[1px] bg-[#C6A76E] transition-all duration-300 group-hover:w-full ${
                location.pathname === link.path ? 'w-full' : ''
              }`} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="absolute right-full mr-4"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-transparent border-b border-[#111111] text-sm focus:outline-none focus:border-[#C6A76E] placeholder-gray-400 font-light"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`hover:opacity-70 transition-opacity ${isSearchOpen ? 'text-[#C6A76E]' : 'text-[#111111]'}`}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <button 
            className="hover:opacity-70 transition-opacity relative"
            onClick={toggleCart}
          >
            <ShoppingBag className="w-5 h-5 text-[#111111]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#111111] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-[#F5F1EB] z-50 lg:hidden shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <Logo className="text-xl text-[#111111]" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[#111111]" />
                </button>
              </div>
              <nav className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-sans tracking-[0.2em] uppercase ${
                      location.pathname === link.path ? 'text-[#C6A76E]' : 'text-[#555555]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

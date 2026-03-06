import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="mb-6">
            <Logo className="text-white" />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Curated women's lifestyle brand. Quality, elegance, and care in every piece.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-[#B8965A] transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#B8965A] transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#B8965A] transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-serif font-semibold mb-6 text-[#B8965A]">Quick Links</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
            <li><Link to="/offers" className="hover:text-white transition-colors">Bundles & Offers</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-serif font-semibold mb-6 text-[#B8965A]">Help</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/return-policy" className="hover:text-white transition-colors">Return Policy</Link></li>
            <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-serif font-semibold mb-6 text-[#B8965A]">Connect</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#B8965A] mt-0.5" />
              <span>+880 1700-524647</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#B8965A] mt-0.5" />
              <span>hello@cenesk.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#B8965A] mt-0.5" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="pt-4">
              <a 
                href="https://wa.me/8801700524647" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] px-4 py-2 rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300 group"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">WhatsApp Concierge</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} CENESK. All rights reserved.</p>
      </div>
    </footer>
  );
}

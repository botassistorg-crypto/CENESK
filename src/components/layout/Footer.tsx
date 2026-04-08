import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#F5F1EB] pt-24 pb-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
        <div>
          <div className="mb-8">
            <Logo className="text-[#F5F1EB]" />
          </div>
          <p className="text-[#999999] text-sm leading-relaxed mb-8 font-light">
            Curated women's lifestyle brand. Quality, elegance, and care in every piece.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#999999] hover:text-[#C6A76E] transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="text-[#999999] hover:text-[#C6A76E] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="text-[#999999] hover:text-[#C6A76E] transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-sans uppercase tracking-[0.2em] mb-8 text-[#C6A76E]">Quick Links</h4>
          <ul className="space-y-4 text-sm text-[#999999] font-light">
            <li><Link to="/shop" className="hover:text-[#F5F1EB] transition-colors">Shop</Link></li>
            <li><Link to="/offers" className="hover:text-[#F5F1EB] transition-colors">Bundles & Offers</Link></li>
            <li><Link to="/about" className="hover:text-[#F5F1EB] transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#F5F1EB] transition-colors">Contact</Link></li>
            <li><Link to="/track-order" className="hover:text-[#F5F1EB] transition-colors">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-sans uppercase tracking-[0.2em] mb-8 text-[#C6A76E]">Help</h4>
          <ul className="space-y-4 text-sm text-[#999999] font-light">
            <li><Link to="/privacy" className="hover:text-[#F5F1EB] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#F5F1EB] transition-colors">Terms of Service</Link></li>
            <li><Link to="/return-policy" className="hover:text-[#F5F1EB] transition-colors">Return Policy</Link></li>
            <li><Link to="/size-guide" className="hover:text-[#F5F1EB] transition-colors">Size Guide</Link></li>
            <li><Link to="/faq" className="hover:text-[#F5F1EB] transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-sans uppercase tracking-[0.2em] mb-8 text-[#C6A76E]">Connect</h4>
          <ul className="space-y-5 text-sm text-[#999999] font-light">
            <li className="flex items-start gap-4">
              <Phone className="w-4 h-4 text-[#C6A76E] mt-0.5" />
              <span>+880 1700-524647</span>
            </li>
            <li className="flex items-start gap-4">
              <Mail className="w-4 h-4 text-[#C6A76E] mt-0.5" />
              <span>info.surriels@gmail.com</span>
            </li>
            <li className="flex items-start gap-4">
              <MapPin className="w-4 h-4 text-[#C6A76E] mt-0.5" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="pt-6">
              <p className="text-xs text-[#555555] mb-4 italic">
                Please send us a message on Email or WhatsApp if you have any inquiry.
              </p>
              <a 
                href="https://wa.me/8801700524647" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-[#333333] text-[#999999] px-6 py-3 hover:bg-[#F5F1EB] hover:text-[#111111] transition-all duration-300 group"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">WhatsApp Concierge</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#222222] mt-16 pt-8 text-center text-[#555555] text-xs tracking-[0.1em] uppercase">
        <p>&copy; {new Date().getFullYear()} SURRIELS. All rights reserved.</p>
      </div>
    </footer>
  );
}

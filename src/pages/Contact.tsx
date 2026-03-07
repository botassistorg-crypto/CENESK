import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-8 text-center">Get in Touch</h1>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question about our products, need assistance with an order, or just want to say hello, we're here for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Contact Form */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A] bg-white">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Product Question</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B8965A]" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#B8965A] text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#9A7D4B] transition-all rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-[#1A1A1A] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6 text-[#B8965A]">Contact Information</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Reach out to us directly via phone, email, or visit our office. We are always happy to connect with our community.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B8965A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#B8965A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Phone & WhatsApp</h3>
                    <p className="text-gray-400">+880 1700-524647</p>
                    <p className="text-gray-500 text-sm">Mon-Fri, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B8965A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#B8965A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email</h3>
                    <p className="text-gray-400">info.cenesek@gmail.com</p>
                    <p className="text-gray-500 text-sm">We reply within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B8965A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#B8965A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Office</h3>
                    <p className="text-gray-400">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12">
              <h3 className="font-bold text-lg mb-4 text-[#B8965A]">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B8965A] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B8965A] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#B8965A] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

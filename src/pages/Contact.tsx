import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Get in Touch</h1>
          <div className="w-12 h-[1px] bg-[#111111] mx-auto mb-6"></div>
          <p className="text-[#555555] font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            We would love to hear from you. Whether you have a question about our pieces, need assistance with an order, or just want to say hello, we are here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#E8DED1]">
          {/* Contact Form */}
          <div className="p-8 md:p-16 bg-transparent">
            <h2 className="text-xs font-sans uppercase tracking-[0.2em] mb-10 text-[#111111]">Send us a Message</h2>
            <form className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Your Name</label>
                <input type="text" className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Subject</label>
                <select className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm appearance-none">
                  <option className="bg-[#F5F1EB]">General Inquiry</option>
                  <option className="bg-[#F5F1EB]">Order Support</option>
                  <option className="bg-[#F5F1EB]">Product Question</option>
                  <option className="bg-[#F5F1EB]">Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#111111] text-[#F5F1EB] py-5 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#C6A76E] transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-[#111111] text-[#F5F1EB] p-8 md:p-16 flex flex-col justify-between">
            <div className="space-y-12">
              <div>
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] mb-6 text-[#C6A76E]">Contact Information</h2>
                <p className="text-[#999999] font-light text-sm leading-relaxed">
                  Reach out to us directly via phone, email, or visit our office. We are always happy to connect with our community.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <Phone className="w-5 h-5 text-[#C6A76E] stroke-[1.5] mt-1" />
                  <div>
                    <h3 className="font-sans text-xs tracking-widest uppercase mb-2">Phone & WhatsApp</h3>
                    <p className="text-[#E8DED1] font-light text-sm">+880 1700-524647</p>
                    <p className="text-[#999999] text-[10px] uppercase tracking-widest mt-1">Mon-Fri, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <Mail className="w-5 h-5 text-[#C6A76E] stroke-[1.5] mt-1" />
                  <div>
                    <h3 className="font-sans text-xs tracking-widest uppercase mb-2">Email</h3>
                    <p className="text-[#E8DED1] font-light text-sm">info.surriels@gmail.com</p>
                    <p className="text-[#999999] text-[10px] uppercase tracking-widest mt-1">We reply within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <MapPin className="w-5 h-5 text-[#C6A76E] stroke-[1.5] mt-1" />
                  <div>
                    <h3 className="font-sans text-xs tracking-widest uppercase mb-2">Office</h3>
                    <p className="text-[#E8DED1] font-light text-sm">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-[#333333]">
              <h3 className="text-[10px] uppercase tracking-[0.2em] mb-6 text-[#999999]">Follow Us</h3>
              <div className="flex gap-6">
                <a href="#" className="text-[#E8DED1] hover:text-[#C6A76E] transition-colors">
                  <Facebook className="w-5 h-5 stroke-[1.5]" />
                </a>
                <a href="#" className="text-[#E8DED1] hover:text-[#C6A76E] transition-colors">
                  <Instagram className="w-5 h-5 stroke-[1.5]" />
                </a>
                <a href="#" className="text-[#E8DED1] hover:text-[#C6A76E] transition-colors">
                  <Twitter className="w-5 h-5 stroke-[1.5]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

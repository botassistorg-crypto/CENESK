import { motion } from 'framer-motion';
import { Users, Star, ShoppingBag, Heart } from 'lucide-react';

const stats = [
  { icon: Users, label: "Happy Clients", value: "500+" },
  { icon: ShoppingBag, label: "Curated Pieces", value: "200+" },
  { icon: Star, label: "Average Rating", value: "4.9" },
  { icon: Heart, label: "Brand Partners", value: "10+" }
];

export default function About() {
  return (
    <div className="bg-[#F5F1EB] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/wrFsGHb6/BRAND-STORY-IMAGE.png')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-[#111111]/40"></div>
        <div className="relative z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-[#F5F1EB] mb-6 tracking-[0.1em] font-light"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs md:text-sm text-[#E8DED1] font-light tracking-[0.2em] uppercase"
          >
            Curating elegance since 2024
          </motion.p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 md:py-32 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="md:w-1/2">
            <img src="https://i.ibb.co.com/wrFsGHb6/BRAND-STORY-IMAGE.png" alt="Brand Story" className="w-full h-auto object-cover aspect-[3/4]" />
          </div>
          <div className="md:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-[#111111] tracking-[0.1em] font-light">A New Standard of Elegance</h2>
            <div className="w-12 h-[1px] bg-[#111111]"></div>
            <p className="text-[#555555] leading-relaxed font-light text-sm md:text-base">
              We started SURRIELS with a simple belief: every woman deserves access to curated, quality pieces without spending hours scrolling through countless pages. We handpick every item in our collection because your time and your style matter.
            </p>
            <p className="text-[#555555] leading-relaxed font-light text-sm md:text-base">
              Our journey began with a passion for discovering unique pieces that blend timeless elegance with modern functionality. Today, we are proud to offer a collection that reflects the diverse lifestyles of women who appreciate luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#E8DED1]/30 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16 md:gap-24">
            <div className="md:w-1/2">
              <img src="https://i.ibb.co.com/Z648W4DX/MISSION-IMAGE.png" alt="Our Mission" className="w-full h-auto object-cover aspect-[3/4]" />
            </div>
            <div className="md:w-1/2 space-y-8 text-left">
              <h2 className="text-3xl md:text-5xl font-serif text-[#111111] tracking-[0.1em] font-light">Our Mission</h2>
              <div className="w-12 h-[1px] bg-[#111111]"></div>
              <p className="text-[#555555] leading-relaxed font-light text-sm md:text-base">
                Our mission is to be the one destination where style, quality, and trust come together. Every piece we offer has been selected with care, tested for quality, and presented with the elegance you deserve.
              </p>
              <p className="text-[#555555] leading-relaxed font-light text-sm md:text-base">
                We believe in empowering women through choices that make them feel confident and beautiful, every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Our Core Values</h2>
        <div className="w-12 h-[1px] bg-[#111111] mx-auto mb-16"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Quality First", desc: "We never compromise on quality. Only the best makes it to our collection." },
            { title: "Curated With Care", desc: "Every piece is handpicked to ensure it meets our high standards of style and utility." },
            { title: "Client Always", desc: "Your satisfaction is our priority. We are here to serve you with dedication." }
          ].map((value, index) => (
            <div key={index} className="bg-transparent p-10 border border-[#E8DED1] hover:border-[#111111] transition-colors duration-500">
              <h3 className="text-sm font-sans uppercase tracking-[0.2em] mb-6 text-[#111111]">{value.title}</h3>
              <p className="text-[#555555] font-light text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#111111] py-24 md:py-32 text-[#F5F1EB]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-6">
                <stat.icon className="w-6 h-6 mx-auto text-[#C6A76E] stroke-[1.5]" />
                <h3 className="text-4xl md:text-5xl font-serif font-light tracking-wide">{stat.value}</h3>
                <p className="text-[#999999] text-[10px] uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

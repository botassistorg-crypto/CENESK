import { motion } from 'framer-motion';
import { Users, Star, ShoppingBag, Heart } from 'lucide-react';

const stats = [
  { icon: Users, label: "Happy Customers", value: "500+" },
  { icon: ShoppingBag, label: "Curated Products", value: "200+" },
  { icon: Star, label: "Average Rating", value: "4.9" },
  { icon: Heart, label: "Brand Partners", value: "10+" }
];

export default function About() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden bg-black flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/wrFsGHb6/BRAND-STORY-IMAGE.png')] bg-cover bg-center opacity-50"></div>
        <div className="relative z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-white mb-4 tracking-wide"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-200 font-light tracking-wider uppercase"
          >
            Curating elegance since 2024
          </motion.p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img src="https://i.ibb.co.com/wrFsGHb6/BRAND-STORY-IMAGE.png" alt="Brand Story" className="rounded-lg shadow-xl w-full h-auto object-cover aspect-[4/3]" />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">A New Standard of Elegance</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              We started CENESK with a simple belief: every woman deserves access to curated, quality products without spending hours scrolling through countless pages. We handpick every item in our collection because your time and your style matter.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our journey began with a passion for discovering unique pieces that blend timeless elegance with modern functionality. Today, we are proud to offer a collection that reflects the diverse lifestyles of women in Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#FAF7F2] py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <img src="https://i.ibb.co.com/Z648W4DX/MISSION-IMAGE.png" alt="Our Mission" className="rounded-lg shadow-xl w-full h-auto object-cover aspect-[4/3]" />
            </div>
            <div className="md:w-1/2 space-y-6 text-right md:text-left">
              <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our mission is to be the one destination where style, quality, and trust come together. Every product we offer has been selected with care, tested for quality, and presented with the elegance you deserve.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                We believe in empowering women through choices that make them feel confident and beautiful, every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-16">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Quality First", desc: "We never compromise on quality. Only the best makes it to our collection." },
            { title: "Curated With Care", desc: "Every item is handpicked to ensure it meets our high standards of style and utility." },
            { title: "Customer Always", desc: "Your satisfaction is our priority. We are here to serve you with dedication." }
          ].map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <h3 className="text-xl font-serif font-bold mb-4 text-[#B8965A]">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1A1A1A] py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-4">
                <stat.icon className="w-8 h-8 mx-auto text-[#B8965A]" />
                <h3 className="text-4xl font-serif font-bold">{stat.value}</h3>
                <p className="text-gray-400 text-sm uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

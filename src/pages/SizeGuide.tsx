import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center justify-center p-4 bg-[#E8DED1]/30 rounded-full mb-8">
              <Ruler className="w-8 h-8 text-[#111111] stroke-[1.5]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Size Guide</h1>
            <div className="w-12 h-[1px] bg-[#111111] mx-auto mb-6"></div>
            <p className="text-[#555555] font-light text-sm md:text-base">
              Find your perfect fit with our comprehensive size guide. Measurements are in inches unless otherwise stated.
            </p>
          </div>
          
          <div className="space-y-16">
            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-8 tracking-wide font-light">Clothing</h2>
              <div className="overflow-x-auto border border-[#E8DED1] bg-transparent">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#E8DED1]/30 text-[#111111]">
                      <th className="p-6 text-[10px] uppercase tracking-[0.2em] border-b border-[#E8DED1]">Size</th>
                      <th className="p-6 text-[10px] uppercase tracking-[0.2em] border-b border-[#E8DED1]">US</th>
                      <th className="p-6 text-[10px] uppercase tracking-[0.2em] border-b border-[#E8DED1]">Bust (in)</th>
                      <th className="p-6 text-[10px] uppercase tracking-[0.2em] border-b border-[#E8DED1]">Waist (in)</th>
                      <th className="p-6 text-[10px] uppercase tracking-[0.2em] border-b border-[#E8DED1]">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#555555] font-light text-sm">
                    <tr className="border-b border-[#E8DED1] hover:bg-[#E8DED1]/10 transition-colors">
                      <td className="p-6 font-sans uppercase tracking-widest text-[#111111]">XS</td>
                      <td className="p-6">0-2</td>
                      <td className="p-6">31-32</td>
                      <td className="p-6">24-25</td>
                      <td className="p-6">34-35</td>
                    </tr>
                    <tr className="border-b border-[#E8DED1] hover:bg-[#E8DED1]/10 transition-colors">
                      <td className="p-6 font-sans uppercase tracking-widest text-[#111111]">S</td>
                      <td className="p-6">4-6</td>
                      <td className="p-6">33-34</td>
                      <td className="p-6">26-27</td>
                      <td className="p-6">36-37</td>
                    </tr>
                    <tr className="border-b border-[#E8DED1] hover:bg-[#E8DED1]/10 transition-colors">
                      <td className="p-6 font-sans uppercase tracking-widest text-[#111111]">M</td>
                      <td className="p-6">8-10</td>
                      <td className="p-6">35-36</td>
                      <td className="p-6">28-29</td>
                      <td className="p-6">38-39</td>
                    </tr>
                    <tr className="border-b border-[#E8DED1] hover:bg-[#E8DED1]/10 transition-colors">
                      <td className="p-6 font-sans uppercase tracking-widest text-[#111111]">L</td>
                      <td className="p-6">12-14</td>
                      <td className="p-6">37-39</td>
                      <td className="p-6">30-32</td>
                      <td className="p-6">40-42</td>
                    </tr>
                    <tr className="hover:bg-[#E8DED1]/10 transition-colors">
                      <td className="p-6 font-sans uppercase tracking-widest text-[#111111]">XL</td>
                      <td className="p-6">16-18</td>
                      <td className="p-6">40-42</td>
                      <td className="p-6">33-35</td>
                      <td className="p-6">43-45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-serif text-[#111111] mb-8 tracking-wide font-light">How to Measure</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-transparent p-8 border border-[#E8DED1]">
                  <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-4 text-[#111111]">Bust</h3>
                  <p className="text-sm text-[#555555] font-light leading-relaxed">Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
                </div>
                <div className="bg-transparent p-8 border border-[#E8DED1]">
                  <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-4 text-[#111111]">Waist</h3>
                  <p className="text-sm text-[#555555] font-light leading-relaxed">Measure around your natural waistline, which is the narrowest part of your waist.</p>
                </div>
                <div className="bg-transparent p-8 border border-[#E8DED1]">
                  <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-4 text-[#111111]">Hips</h3>
                  <p className="text-sm text-[#555555] font-light leading-relaxed">Measure around the fullest part of your hips, keeping the tape parallel to the floor.</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

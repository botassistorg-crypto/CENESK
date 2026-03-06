import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';

export default function SizeGuide() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#FAF7F2] p-3 rounded-full">
            <Ruler className="w-8 h-8 text-[#B8965A]" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#1A1A1A]">Size Guide</h1>
        </div>
        
        <p className="text-gray-600 mb-12 text-lg">
          Find your perfect fit with our comprehensive size guide. Measurements are in inches unless otherwise stated.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-[#1A1A1A] mb-6">Clothing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[#1A1A1A]">
                    <th className="p-4 font-serif font-bold border-b border-gray-200">Size</th>
                    <th className="p-4 font-serif font-bold border-b border-gray-200">US</th>
                    <th className="p-4 font-serif font-bold border-b border-gray-200">Bust (in)</th>
                    <th className="p-4 font-serif font-bold border-b border-gray-200">Waist (in)</th>
                    <th className="p-4 font-serif font-bold border-b border-gray-200">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">XS</td>
                    <td className="p-4">0-2</td>
                    <td className="p-4">31-32</td>
                    <td className="p-4">24-25</td>
                    <td className="p-4">34-35</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">S</td>
                    <td className="p-4">4-6</td>
                    <td className="p-4">33-34</td>
                    <td className="p-4">26-27</td>
                    <td className="p-4">36-37</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">M</td>
                    <td className="p-4">8-10</td>
                    <td className="p-4">35-36</td>
                    <td className="p-4">28-29</td>
                    <td className="p-4">38-39</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">L</td>
                    <td className="p-4">12-14</td>
                    <td className="p-4">37-39</td>
                    <td className="p-4">30-32</td>
                    <td className="p-4">40-42</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">XL</td>
                    <td className="p-4">16-18</td>
                    <td className="p-4">40-42</td>
                    <td className="p-4">33-35</td>
                    <td className="p-4">43-45</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-[#1A1A1A] mb-6">How to Measure</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#1A1A1A] mb-2">Bust</h3>
                <p className="text-sm text-gray-500">Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#1A1A1A] mb-2">Waist</h3>
                <p className="text-sm text-gray-500">Measure around your natural waistline, which is the narrowest part of your waist.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#1A1A1A] mb-2">Hips</h3>
                <p className="text-sm text-gray-500">Measure around the fullest part of your hips, keeping the tape parallel to the floor.</p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

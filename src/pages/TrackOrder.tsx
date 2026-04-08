import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStatus('Processing');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] bg-[#F5F1EB] py-20 md:py-32">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-[#111111] mb-6 tracking-[0.1em] font-light">Track Your Order</h1>
        <p className="text-[#555555] mb-12 font-light">Enter your order ID or phone number to check the status of your order.</p>

        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-6 mb-16">
          <input
            type="text"
            placeholder="Order ID (e.g., SURRIELS-12345)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 px-6 py-4 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111111] text-[#F5F1EB] px-10 py-4 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#C6A76E] transition-colors flex items-center justify-center gap-3 min-w-[180px] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 stroke-[1.5]" /> Track Order</>}
          </button>
        </form>

        {status && (
          <div className="bg-transparent border border-[#E8DED1] p-8 md:p-12 text-left">
            <div className="flex justify-between items-center mb-10 border-b border-[#E8DED1] pb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#999999] mb-2">Order ID</p>
                <p className="font-sans text-sm tracking-widest text-[#111111] uppercase">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#999999] mb-2">Estimated Delivery</p>
                <p className="font-sans text-sm tracking-widest text-[#111111] uppercase">Within 3-5 days</p>
              </div>
            </div>

            <div className="relative pt-10 pb-6">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#E8DED1]">
                <div className="h-full bg-[#111111] w-1/3 transition-all duration-1000"></div>
              </div>
              <div className="flex justify-between text-[10px] font-light text-[#999999] uppercase tracking-[0.2em] relative -top-4">
                <span className="text-[#111111]">Processing</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </div>

            <div className="mt-8 bg-[#E8DED1]/30 p-6 text-sm text-[#555555] font-light border border-[#E8DED1]">
              <p>Your order is currently being processed. We will notify you once it's shipped.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
      <h1 className="text-4xl font-serif text-[#1A1A1A] mb-8">Track Your Order</h1>
      <p className="text-gray-500 mb-8">Enter your order ID or phone number to check the status of your order.</p>

      <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-12">
        <input
          type="text"
          placeholder="Order ID (e.g., CENESK-12345)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 px-6 py-3 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A]"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#B8965A] text-white px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-[#9A7D4B] transition-colors rounded-sm flex items-center justify-center gap-2 min-w-[160px]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4" /> Track Order</>}
        </button>
      </form>

      {status && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-left">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-bold text-[#1A1A1A]">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="font-bold text-[#1A1A1A]">Within 3-5 days</p>
            </div>
          </div>

          <div className="relative pt-8 pb-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#B8965A] w-1/3 rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wider relative -top-3">
              <span className="text-[#B8965A]">Processing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-4 rounded text-sm text-gray-600">
            <p>Your order is currently being processed. We will notify you once it's shipped.</p>
          </div>
        </div>
      )}
    </div>
  );
}

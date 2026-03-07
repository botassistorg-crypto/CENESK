import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { submitOrder } from '../lib/api';
import { toast } from 'sonner';
import { ShieldCheck, Loader2 } from 'lucide-react';
import Logo from '../components/ui/Logo';

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  division: string;
  district: string;
  address: string;
  notes: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  transactionId?: string;
  senderNumber?: string;
}

const divisions = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"];

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      paymentMethod: 'bkash',
      division: 'Dhaka'
    }
  });

  const selectedDivision = watch('division');
  const selectedPaymentMethod = watch('paymentMethod');
  
  const deliveryFee = selectedDivision === 'Dhaka' ? 70 : 150;
  const total = cartTotal + deliveryFee;

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: data.fullName,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        address: `${data.address}, ${data.district}, ${data.division}`,
        division: data.division,
        district: data.district,
        paymentMethod: data.paymentMethod,
        transactionId: data.paymentMethod === 'bkash' ? `${data.transactionId} (Sender: ${data.senderNumber})` : data.transactionId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          variant: `${item.size || ''} ${item.color || ''}`.trim()
        })),
        total,
        deliveryFee,
        subtotal: cartTotal,
        discount: 0, // Add logic for discount if needed later
        notes: data.notes
      };

      await submitOrder(orderData);
      
      clearCart();
      toast.success("Order placed successfully!");
      navigate('/order-confirmation', { state: { orderId: `CENESK-${Math.floor(10000 + Math.random() * 90000)}` } });
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p>Your cart is empty. <Link to="/shop" className="text-[#B8965A] underline">Go shopping</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Logo className="justify-center text-3xl" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Customer Info */}
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-serif font-bold mb-4 text-[#1A1A1A]">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      {...register('fullName', { required: "Full name is required" })}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A]"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      {...register('email', { required: "Email is required" })}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A]"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      {...register('phone', { required: "Phone number is required" })}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A]"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      {...register('whatsapp')}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A]"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-serif font-bold mb-4 text-[#1A1A1A]">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Division *</label>
                    <select
                      {...register('division', { required: "Division is required" })}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A] bg-white"
                    >
                      {divisions.map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                    <input
                      {...register('district', { required: "District is required" })}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A]"
                    />
                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                    <textarea
                      {...register('address', { required: "Address is required" })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A]"
                      placeholder="House, Road, Area, Landmark..."
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
                    <textarea
                      {...register('notes')}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A]"
                      placeholder="Special instructions for delivery rider..."
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-serif font-bold mb-4 text-[#1A1A1A]">Payment Method</h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 mb-4">
                    <p className="font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Advance Payment Required
                    </p>
                    <p className="mt-1">To ensure genuine orders and fast delivery from our premium partners, we currently accept full advance payment only.</p>
                  </div>

                  <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'bkash' ? 'border-[#B8965A] bg-[#B8965A]/5' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      value="bkash"
                      {...register('paymentMethod')}
                      className="mt-1 accent-[#B8965A]"
                      defaultChecked
                    />
                    <div className="w-full">
                      <span className="font-bold block text-[#1A1A1A]">bKash Payment</span>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-2 mb-3 border border-gray-100">
                        <p className="font-medium mb-1">How to Pay:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Go to your bKash App</li>
                          <li>Select <strong>"Send Money"</strong></li>
                          <li>Enter Number: <strong className="text-[#B8965A] text-base">01628164979</strong></li>
                          <li>Enter Amount: <strong>৳{formatPrice(total).replace('BDT', '').trim()}</strong></li>
                          <li>Reference: Your Name</li>
                        </ol>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Your bKash Number (Sender)</label>
                          <input
                            {...register('senderNumber', { required: "Sender number is required" })}
                            placeholder="e.g., 017XXXXXXXX"
                            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A] text-sm"
                          />
                          <p className="text-[10px] text-gray-500 mt-1">We need this to verify your payment automatically.</p>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Transaction ID (TrxID)</label>
                          <input
                            {...register('transactionId', { required: "Transaction ID is required" })}
                            placeholder="e.g., 8N7A6D5F"
                            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A] text-sm"
                          />
                          <p className="text-[10px] text-gray-500 mt-1">
                            Check your bKash SMS or App notification. It looks like: <span className="font-mono bg-gray-100 px-1 rounded">TrxID : DBS6JXU6IU</span>
                          </p>
                        </div>
                      </div>
                      {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId.message}</p>}
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'nagad' ? 'border-[#B8965A] bg-[#B8965A]/5' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      value="nagad"
                      {...register('paymentMethod')}
                      className="mt-1 accent-[#B8965A]"
                    />
                    <div className="w-full">
                      <span className="font-bold block text-[#1A1A1A]">Nagad Payment</span>
                      <span className="text-sm text-gray-500 block mb-2">Send payment to: 01XXXXXXXXX (Personal)</span>
                      {selectedPaymentMethod === 'nagad' && (
                        <input
                          {...register('transactionId', { required: selectedPaymentMethod === 'nagad' ? "Transaction ID is required" : false })}
                          placeholder="Enter Transaction ID"
                          className="w-full mt-2 px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#B8965A] text-sm"
                        />
                      )}
                      {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId.message}</p>}
                    </div>
                  </label>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#B8965A] text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#9A7D4B] transition-all rounded-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
              <p className="text-center text-xs text-gray-500">
                By placing this order you agree to our Terms of Service
              </p>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-8">
              <h3 className="text-lg font-serif font-bold mb-4 text-[#1A1A1A]">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.cartId} className="flex gap-3 text-sm">
                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#1A1A1A] line-clamp-2">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-[#1A1A1A]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#1A1A1A] pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#B8965A]">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

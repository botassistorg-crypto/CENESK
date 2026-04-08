import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { placeOrder, getSettings } from '../lib/api';
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
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then(res => {
      if (res.success) setSettings(res.data);
    });
  }, []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      paymentMethod: 'cod',
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
        transactionId: (data.paymentMethod === 'bkash' || data.paymentMethod === 'nagad') ? `${data.transactionId || 'N/A'} (Sender: ${data.senderNumber || 'N/A'})` : (data.transactionId || 'N/A'),
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

      await placeOrder(orderData);
      
      clearCart();
      toast.success("Order placed successfully!");
      navigate('/order-confirmation', { state: { orderId: `SURRIELS-${Math.floor(10000 + Math.random() * 90000)}` } });
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-[#F5F1EB] min-h-screen flex flex-col items-center justify-center">
        <p className="text-[#555555] font-light">Your cart is empty. <Link to="/shop" className="text-[#111111] border-b border-[#111111] pb-0.5 hover:text-[#C6A76E] hover:border-[#C6A76E] transition-colors">Go shopping</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <Logo className="justify-center text-3xl text-[#111111]" />
        </div>

        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* Customer Info */}
              <section className="bg-transparent">
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] mb-8 text-[#111111] border-b border-[#E8DED1] pb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Full Name *</label>
                    <input
                      {...register('fullName', { required: "Full name is required" })}
                      className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-2">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Email Address *</label>
                    <input
                      type="email"
                      {...register('email', { required: "Email is required" })}
                      className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      {...register('phone', { required: "Phone number is required" })}
                      className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-2">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      {...register('whatsapp')}
                      className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="bg-transparent">
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] mb-8 text-[#111111] border-b border-[#E8DED1] pb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Division *</label>
                    <select
                      {...register('division', { required: "Division is required" })}
                      className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm appearance-none"
                    >
                      {divisions.map(div => (
                        <option key={div} value={div} className="bg-[#F5F1EB]">{div}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">District *</label>
                    <input
                      {...register('district', { required: "District is required" })}
                      className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                    />
                    {errors.district && <p className="text-red-500 text-xs mt-2">{errors.district.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Full Address *</label>
                    <textarea
                      {...register('address', { required: "Address is required" })}
                      rows={3}
                      className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                      placeholder="House, Road, Area, Landmark..."
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-2">{errors.address.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Delivery Notes (Optional)</label>
                    <textarea
                      {...register('notes')}
                      rows={2}
                      className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                      placeholder="Special instructions for delivery rider..."
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-transparent">
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] mb-8 text-[#111111] border-b border-[#E8DED1] pb-4">Payment Method</h2>
                <div className="space-y-6">
                  <label className={`flex items-start gap-4 p-6 border cursor-pointer transition-colors ${selectedPaymentMethod === 'cod' ? 'border-[#111111] bg-[#E8DED1]/30' : 'border-[#E8DED1]'}`}>
                    <input
                      type="radio"
                      value="cod"
                      {...register('paymentMethod')}
                      className="mt-1 accent-[#111111]"
                    />
                    <div className="w-full">
                      <span className="font-sans text-sm tracking-widest uppercase block text-[#111111] mb-2">Cash on Delivery</span>
                      <span className="text-xs text-[#555555] block font-light">Pay when you receive your order.</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-6 border cursor-pointer transition-colors ${selectedPaymentMethod === 'bkash' ? 'border-[#111111] bg-[#E8DED1]/30' : 'border-[#E8DED1]'}`}>
                    <input
                      type="radio"
                      value="bkash"
                      {...register('paymentMethod')}
                      className="mt-1 accent-[#111111]"
                      defaultChecked
                    />
                    <div className="w-full">
                      <span className="font-sans text-sm tracking-widest uppercase block text-[#111111] mb-4">bKash Payment</span>
                      <div className="text-xs text-[#555555] bg-[#F5F1EB] p-4 border border-[#E8DED1] mb-6 font-light">
                        <p className="font-medium mb-3 uppercase tracking-widest text-[#111111]">How to Pay (Optional Advance Payment):</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Go to your bKash App</li>
                          <li>Select <strong>"Send Money"</strong></li>
                          <li>Enter Number: <strong className="text-[#111111] text-sm">{settings?.bkash_number || '01628164979'}</strong></li>
                          <li>Enter Amount: <strong>৳{formatPrice(total).replace('BDT', '').trim()}</strong></li>
                          <li>Reference: Your Name</li>
                        </ol>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Your bKash Number (Sender) <span className="text-[#999999] font-light">(Optional)</span></label>
                          <input
                            {...register('senderNumber')}
                            placeholder="The number you sent money FROM"
                            className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Transaction ID (TrxID) <span className="text-[#999999] font-light">(Optional)</span></label>
                          <input
                            {...register('transactionId')}
                            placeholder="e.g., 8N7A6D5F"
                            className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                          />
                        </div>
                      </div>
                      {errors.transactionId && <p className="text-red-500 text-xs mt-2">{errors.transactionId.message}</p>}
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-6 border cursor-pointer transition-colors ${selectedPaymentMethod === 'nagad' ? 'border-[#111111] bg-[#E8DED1]/30' : 'border-[#E8DED1]'}`}>
                    <input
                      type="radio"
                      value="nagad"
                      {...register('paymentMethod')}
                      className="mt-1 accent-[#111111]"
                    />
                    <div className="w-full">
                      <span className="font-sans text-sm tracking-widest uppercase block text-[#111111] mb-4">Nagad Payment</span>
                      <div className="text-xs text-[#555555] bg-[#F5F1EB] p-4 border border-[#E8DED1] mb-6 font-light">
                        <p className="font-medium mb-3 uppercase tracking-widest text-[#111111]">How to Pay (Optional Advance Payment):</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Go to your Nagad App</li>
                          <li>Select <strong>"Send Money"</strong></li>
                          <li>Enter Number: <strong className="text-[#111111] text-sm">{settings?.nagad_number || '01XXXXXXXXX'}</strong></li>
                          <li>Enter Amount: <strong>৳{formatPrice(total).replace('BDT', '').trim()}</strong></li>
                          <li>Reference: Your Name</li>
                        </ol>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Your Nagad Number (Sender) <span className="text-[#999999] font-light">(Optional)</span></label>
                          <input
                            {...register('senderNumber')}
                            placeholder="The number you sent money FROM"
                            className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555555] mb-2">Transaction ID (TrxID) <span className="text-[#999999] font-light">(Optional)</span></label>
                          <input
                            {...register('transactionId')}
                            placeholder="e.g., 8N7A6D5F"
                            className="w-full px-4 py-3 bg-transparent border border-[#E8DED1] focus:outline-none focus:border-[#111111] transition-colors font-light text-sm"
                          />
                        </div>
                      </div>
                      {errors.transactionId && <p className="text-red-500 text-xs mt-2">{errors.transactionId.message}</p>}
                    </div>
                  </label>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#111111] text-[#F5F1EB] py-5 uppercase tracking-[0.2em] text-xs font-light hover:bg-[#C6A76E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
              <p className="text-center text-[10px] uppercase tracking-[0.1em] text-[#999999] font-light">
                By placing this order you agree to our Terms of Service
              </p>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-[#E8DED1]/30 p-8 border border-[#E8DED1] sticky top-32">
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] mb-8 text-[#111111] border-b border-[#E8DED1] pb-4">Order Summary</h3>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.cartId} className="flex gap-4 text-sm">
                    <div className="w-16 h-20 bg-[#E8DED1] overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-xs tracking-widest uppercase text-[#111111] mb-1">{item.name}</p>
                      <p className="text-[#999999] text-[10px] uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-light text-[#111111]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-[#E8DED1] text-sm font-light">
                <div className="flex justify-between text-[#555555]">
                  <span>Subtotal</span>
                  <span className="text-[#111111]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#555555]">
                  <span>Delivery Fee</span>
                  <span className="text-[#111111]">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between items-center pt-6 mt-2 border-t border-[#E8DED1]">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#111111]">Total</span>
                  <span className="text-xl text-[#111111]">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8DED1] text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#999999] flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3 h-3 stroke-[1.5]" /> Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

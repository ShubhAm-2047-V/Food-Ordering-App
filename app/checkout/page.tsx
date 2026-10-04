'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/navigation';
import { Order } from '@/types';

export default function CheckoutPage() {
  const {
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartTax,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    placeOrder,
    user
  } = useApp();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [deliveryInstruction, setDeliveryInstruction] = useState<string>('Leave at door & ring bell');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState<string>('aarav@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const customInstructions = [
    'Leave at door & ring bell',
    'Do not ring bell (Baby sleeping)',
    'Hand over directly to me',
    'Leave with building security'
  ];

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    const activeAddress = user.savedAddresses[selectedAddressIndex] || {
      id: 'custom',
      tag: 'Home' as const,
      address: 'Indiranagar 100ft Road, Bengaluru',
      isDefault: true
    };

    try {
      const order = await placeOrder(
        {
          street: activeAddress.address,
          city: 'Bengaluru',
          tag: activeAddress.tag,
          instructions: deliveryInstruction
        },
        paymentMethod
      );

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }

      setCompletedOrder(order);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was just placed, display the Animated Order Success Experience
  if (completedOrder) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-card-lg p-8 sm:p-12 border border-slate-100 shadow-2xl relative overflow-hidden"
        >
          {/* Confetti Glow Background */}
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-5xl mb-6 shadow-glow-green">
            🎉
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-brand-orange block mb-1">
            ORDER #{completedOrder.id} CONFIRMED
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900">
            YOUR FOOD IS ON THE WAY!
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Estimated Arrival: <strong>~{completedOrder.estimatedDeliveryMin} minutes</strong>
          </p>

          {/* Animated Delivery Tracker Stepper */}
          <div className="my-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Delivery Status</span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Live Cooking Simulator</span>
            </div>

            <div className="relative pl-6 space-y-6 border-l-2 border-brand-orange">
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-orange ring-4 ring-orange-100" />
                <h4 className="text-sm font-bold text-slate-900">Order Confirmed by CRAVO</h4>
                <p className="text-xs text-slate-500 mt-0.5">Kitchen has accepted your order.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-orange animate-ping" />
                <h4 className="text-sm font-bold text-brand-orange">Kitchen is Preparing Your Fresh Meal</h4>
                <p className="text-xs text-slate-500 mt-0.5">Chef is cooking with fresh ingredients.</p>
              </div>

              <div className="relative opacity-50">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-300" />
                <h4 className="text-sm font-bold text-slate-700">Rider Pick-up &amp; Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hot thermal packaging on electric bike.</p>
              </div>
            </div>
          </div>

          {/* Points Earned Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between mb-8">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              You earned +{completedOrder.foodPointsEarned} CRAVO Loyalty Points!
            </span>
            <a href="/profile" className="text-brand-orange hover:underline">View Level &gt;</a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/orders"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Track Live in Orders 📦
            </a>
            <a
              href="/"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Back to Home 🏠
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 flex items-center justify-center text-4xl mb-4">
            🛒
          </div>
          <h2 className="text-xl font-black font-display text-slate-900">Your bag is empty</h2>
          <p className="text-xs text-slate-500 mt-1">Add your favorite meals before checking out.</p>
          <a
            href="/food-mood"
            className="mt-6 inline-block px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
          >
            Explore Food Moods
          </a>
        </div>
      </div>
    );
  }

  return (
    <div data-theme="checkout" className="min-h-screen py-10 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <span className="text-xs font-black text-brand-orange uppercase tracking-wider">Fast Secure Checkout</span>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-950">
            Finalize Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Delivery Address */}
            <div className="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-orange" />
                  <h3 className="text-base font-bold text-slate-900">Delivery Address</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.savedAddresses.map((addr, idx) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all ${
                      selectedAddressIndex === idx
                        ? 'border-brand-orange bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase text-slate-900">{addr.tag}</span>
                      {selectedAddressIndex === idx && <CheckCircle2 className="w-4 h-4 text-brand-orange" />}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{addr.address}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Delivery Instructions */}
            <div className="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft">
              <h3 className="text-base font-bold text-slate-900 mb-3">Delivery Preference</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {customInstructions.map(inst => (
                  <button
                    key={inst}
                    onClick={() => setDeliveryInstruction(inst)}
                    className={`p-3 rounded-xl text-left text-xs font-bold transition-all border ${
                      deliveryInstruction === inst
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft">
              <h3 className="text-base font-bold text-slate-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-brand-orange bg-orange-50/40' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
                        UPI
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Instant UPI (GPay / PhonePe / Paytm)</h4>
                        <span className="text-xs text-slate-500">Zero transaction charges</span>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && <CheckCircle2 className="w-5 h-5 text-brand-orange" />}
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-orange-200/60 flex items-center gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-slate-300 outline-none"
                        placeholder="yourname@upi"
                      />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-brand-orange bg-orange-50/40' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Credit / Debit Card</h4>
                        <span className="text-xs text-slate-500">Visa, Mastercard, RuPay</span>
                      </div>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-brand-orange" />}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-brand-orange bg-orange-50/40' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Cash On Delivery</h4>
                        <span className="text-xs text-slate-500">Pay cash or scan QR upon arrival</span>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-brand-orange" />}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft sticky top-28">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items */}
              <div className="space-y-3 max-h-56 overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={item.food.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{item.quantity}x</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[150px]">{item.food.name}</span>
                    </div>
                    <span className="font-extrabold text-slate-900">₹{item.food.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-800">
                    {cartDeliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${cartDeliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-bold text-slate-800">₹{cartTax}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{cartDiscount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-xl font-black text-brand-orange font-display">₹{cartTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-brand-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>PLACE ORDER (₹{cartTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

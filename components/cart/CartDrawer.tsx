'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  Check, 
  Percent,
  PlusCircle
} from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTax,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    freeDeliveryThreshold,
    distanceToFreeDelivery,
    foods,
    addToCart
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  // Smart Add-on recommendations (beverages/desserts not already in cart)
  const cartFoodIds = new Set(cart.map(c => c.food.id));
  const smartAddOns = foods
    .filter(f => !cartFoodIds.has(f.id) && (f.category === 'drinks' || f.category === 'dessert' || f.price <= 45))
    .slice(0, 3);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-md flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full bg-white shadow-2xl flex flex-col justify-between h-full"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 pt-safe">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-display">Your Craving Bag</h3>
                    <span className="text-xs text-slate-500 font-semibold">{cart.length} unique {cart.length === 1 ? 'item' : 'items'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Free Delivery Bar */}
              {cart.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-100 px-4 sm:px-5 py-3">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <Truck className="w-4 h-4 text-brand-orange" />
                      {distanceToFreeDelivery === 0 ? (
                        <span className="text-emerald-600">🎉 FREE Delivery Unlocked!</span>
                      ) : (
                        <span>Add <strong className="text-brand-orange">₹{distanceToFreeDelivery}</strong> for FREE Delivery</span>
                      )}
                    </span>
                    <span className="text-slate-500 text-[11px]">Target: ₹{freeDeliveryThreshold}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-brand-orange to-brand-pink rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {cart.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 flex items-center justify-center text-4xl mb-4">
                      🍲
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Your bag is empty</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Explore our Food Moods or build a ₹100 combo to fill your cart with delicious bites.
                    </p>
                    <div className="mt-6 flex flex-col gap-2">
                      <Link
                        href="/food-mood"
                        onClick={() => setIsCartOpen(false)}
                        className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-pink text-white text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 text-center"
                      >
                        Explore Food Mood 😋
                      </Link>
                      <Link
                        href="/under-100"
                        onClick={() => setIsCartOpen(false)}
                        className="px-5 py-3.5 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 text-center"
                      >
                        Meals Under ₹100 🎯
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Items List */}
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div
                          key={item.food.id}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                          <img
                            src={item.food.image}
                            alt={item.food.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <h4 className="text-xs font-bold text-slate-900 truncate">{item.food.name}</h4>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 truncate">{item.restaurantName}</span>
                            <span className="text-xs font-extrabold text-slate-900 mt-1 block">₹{item.food.price * item.quantity}</span>
                          </div>

                          {/* Quantity selector with finger-friendly buttons */}
                          <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-xs p-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.food.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-brand-orange active:scale-90"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.food.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-brand-orange active:scale-90"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Smart Add-ons */}
                    {smartAddOns.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Complete your combo</span>
                        </div>
                        <div className="space-y-2">
                          {smartAddOns.map(addon => (
                            <div key={addon.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-amber-100/80">
                              <div className="flex items-center gap-2 min-w-0">
                                <img src={addon.image} alt={addon.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{addon.name}</p>
                                  <span className="text-[11px] font-extrabold text-brand-orange">₹{addon.price}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(addon)}
                                className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-brand-orange text-brand-orange hover:text-white text-[11px] font-bold transition-colors border border-orange-200 shrink-0 ml-2"
                              >
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Coupon Input & Available Pill */}
                    <div className="space-y-2">
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Promo Code"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-800 uppercase outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Apply
                        </button>
                      </form>

                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                          <div className="flex items-center gap-1.5">
                            <Percent className="w-4 h-4 text-emerald-600" />
                            <span>{appliedCoupon.code} applied (-₹{cartDiscount})</span>
                          </div>
                          <button onClick={removeCoupon} className="text-rose-500 hover:text-rose-700 text-[11px]">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                          {coupons.slice(0, 2).map(c => (
                            <button
                              key={c.code}
                              onClick={() => applyCoupon(c.code)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-brand-orange text-[10px] font-bold text-slate-600 border border-slate-200 shrink-0"
                            >
                              🏷️ {c.code}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bill Breakdown */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Item Total</span>
                        <span className="font-bold text-slate-800">₹{cartSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-slate-800">
                          {cartDeliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${cartDeliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST & Packaging</span>
                        <span className="font-bold text-slate-800">₹{cartTax}</span>
                      </div>
                      {cartDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Promo Discount</span>
                          <span>-₹{cartDiscount}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                        <span>To Pay</span>
                        <span className="text-base font-black text-brand-orange font-display">₹{cartTotal}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Checkout CTA */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-white pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full flex items-center justify-between px-5 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple text-white font-extrabold text-sm shadow-xl shadow-brand-orange/30 hover:shadow-brand-orange/50 active:scale-[0.99] transition-all"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">Total to pay</span>
                      <span className="text-base sm:text-lg font-black font-display leading-tight">₹{cartTotal}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-bold">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

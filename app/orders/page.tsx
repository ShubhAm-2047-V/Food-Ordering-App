'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  RotateCcw, 
  ChevronRight, 
  Flame, 
  ShieldCheck,
  Bike
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';

export default function OrdersPage() {
  const { orders, addToCart, showToast } = useApp();

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.food, item.quantity);
    });
    showToast(`Items from Order #${order.id} added to cart! 😋`, 'success');
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'picked_up': return 3;
      case 'on_the_way': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen py-10 pb-24 bg-brand-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-brand-orange">Order Management</span>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-950">
            Live Deliveries &amp; History
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-card p-12 text-center border border-slate-200/80 shadow-soft">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 text-4xl flex items-center justify-center mb-4">
              📦
            </div>
            <h3 className="text-xl font-black font-display text-slate-900">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Ready to satisfy your cravings? Explore our Food Moods or build a ₹100 combo!
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href="/food-mood"
                className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Explore Food Mood 😋
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Active Order Spotlight */}
            {orders.map((order, idx) => {
              const currentStep = getStatusStepIndex(order.status);
              const isLive = order.status !== 'delivered';

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-card-lg p-6 sm:p-8 border shadow-soft transition-all ${
                    isLive ? 'border-2 border-brand-orange shadow-glow-orange/20' : 'border-slate-200'
                  }`}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">ORDER #{order.id}</span>
                        {isLive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-brand-orange text-[10px] font-black uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" /> LIVE TRACKING
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-xs text-slate-400 font-bold block">Total Amount</span>
                        <span className="text-xl font-black text-slate-900 font-display">₹{order.total}</span>
                      </div>
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reorder
                      </button>
                    </div>
                  </div>

                  {/* 5-Step Animated Delivery Pipeline */}
                  <div className="py-6">
                    <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-4">
                      Delivery Progress
                    </span>

                    <div className="grid grid-cols-5 gap-2 text-center text-xs">
                      {[
                        { step: 1, label: 'Confirmed', icon: CheckCircle2 },
                        { step: 2, label: 'Cooking', icon: Flame },
                        { step: 3, label: 'Picked Up', icon: Bike },
                        { step: 4, label: 'On The Way', icon: Clock },
                        { step: 5, label: 'Delivered', icon: CheckCircle2 },
                      ].map((s) => {
                        const Icon = s.icon;
                        const isDone = currentStep >= s.step;
                        const isCurrent = currentStep === s.step;

                        return (
                          <div key={s.step} className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-all ${
                                isDone
                                  ? 'bg-brand-orange text-white shadow-md shadow-orange-500/30'
                                  : 'bg-slate-100 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-orange-200 animate-pulse' : ''}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[11px] font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                      Dishes in this order ({order.items.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map(item => (
                        <div key={item.food.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <img src={item.food.image} alt={item.food.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{item.food.name}</h4>
                            <span className="text-[10px] text-slate-500">{item.restaurantName}</span>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-xs font-black text-slate-800">Qty: {item.quantity}</span>
                              <span className="text-xs font-black text-brand-orange">₹{item.food.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                        {order.deliveryAddress.street}
                      </span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        +{order.foodPointsEarned} CRAVO Pts Earned
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

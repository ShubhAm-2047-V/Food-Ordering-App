'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Flame, Smile, Coins, Bot, Clock, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileNav() {
  const pathname = usePathname();
  const { cartItemCount, cartTotal, setIsCartOpen } = useApp();

  const tabs = [
    { href: '/', label: 'Home', icon: Flame, color: 'text-amber-500' },
    { href: '/food-mood', label: 'Mood', icon: Smile, color: 'text-pink-500' },
    { href: '/under-100', label: '₹100', icon: Coins, color: 'text-emerald-500' },
    { href: '/ai-planner', label: 'AI', icon: Bot, color: 'text-purple-500' },
    { href: '/orders', label: 'Orders', icon: Clock, color: 'text-blue-500' },
  ];

  return (
    <>
      {/* Floating cart pill on mobile if items exist */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-4 right-4 z-40 lg:hidden"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl shadow-slate-900/40 border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-orange text-white flex items-center justify-center font-bold text-xs">
                  {cartItemCount}
                </div>
                <span className="text-sm font-bold">View Cart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-amber-400">₹{cartTotal}</span>
                <span className="text-xs font-semibold text-slate-300">Proceed →</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-2">
        <div className="flex items-center justify-around">
          {tabs.map(tab => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <a
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  isActive ? 'text-slate-950 font-black' : 'text-slate-400 font-semibold hover:text-slate-700'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-400'}`} />
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavActiveIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900"
                    />
                  )}
                </div>
                <span className="text-[11px] mt-1">{tab.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

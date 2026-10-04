'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Smile, Coins, Bot, Clock, Compass } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileNav() {
  const pathname = usePathname();
  const { cartItemCount, cartTotal, setIsCartOpen } = useApp();

  const tabs = [
    { href: '/', label: 'Home', icon: Flame, color: 'text-amber-500' },
    { href: '/food-mood', label: 'Mood', icon: Smile, color: 'text-pink-500' },
    { href: '/under-100', label: '₹100', icon: Coins, color: 'text-emerald-500' },
    { href: '/ai-planner', label: 'AI Plan', icon: Bot, color: 'text-purple-500' },
    { href: '/orders', label: 'Orders', icon: Clock, color: 'text-blue-500' },
  ];

  return (
    <>
      {/* Floating cart pill on mobile if items exist */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,8px))] left-3 right-3 z-40 lg:hidden max-w-lg mx-auto"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-xl text-white shadow-2xl shadow-slate-950/50 border border-slate-700/60 active:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-orange to-brand-pink text-white flex items-center justify-center font-black text-xs shadow-md">
                  {cartItemCount}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-100">View Cart</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} added</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-amber-400 font-display">₹{cartTotal}</span>
                <span className="text-xs font-bold text-slate-200 bg-white/15 px-2 py-1 rounded-lg">Proceed →</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,4px))] shadow-lg shadow-slate-900/10"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map(tab => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative select-none touch-manipulation ${
                  isActive ? 'text-slate-950 font-black' : 'text-slate-400 font-semibold active:text-slate-700'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? `${tab.color} scale-110` : 'text-slate-400'}`} />
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavActiveIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900"
                    />
                  )}
                </div>
                <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-black text-slate-900' : 'font-medium text-slate-500'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

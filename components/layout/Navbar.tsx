'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  ShoppingBag, 
  MapPin, 
  Search, 
  ChevronDown, 
  Flame, 
  Smile, 
  Coins, 
  Bot, 
  Compass, 
  Clock, 
  User, 
  Award,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = [
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'Bandra West, Mumbai',
  'Connaught Place, Delhi',
  'Cyber City, Gurugram',
  'Koregaon Park, Pune',
  'Jubilee Hills, Hyderabad'
];

export function Navbar() {
  const pathname = usePathname();
  const { 
    cartItemCount, 
    cartTotal, 
    setIsCartOpen, 
    user, 
    currentLocation, 
    setCurrentLocation,
    foods,
    addToCart,
    setPreviewFood
  } = useApp();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.trim() === '' ? [] : foods.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 6);

  const navLinks = [
    { href: '/', label: 'Home', icon: Flame, color: 'hover:text-amber-500' },
    { href: '/food-mood', label: 'Food Mood', icon: Smile, color: 'hover:text-pink-500', badge: 'Popular' },
    { href: '/under-100', label: 'Under ₹100', icon: Coins, color: 'hover:text-emerald-500', badge: 'Value' },
    { href: '/ai-planner', label: 'AI Planner', icon: Bot, color: 'hover:text-purple-500', badge: 'Smart' },
    { href: '/explore', label: 'Explore', icon: Compass, color: 'hover:text-blue-500' },
    { href: '/orders', label: 'Orders', icon: Clock, color: 'hover:text-slate-900' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-slate-100/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-orange via-brand-pink to-brand-purple flex items-center justify-center shadow-lg shadow-brand-orange/20 group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-display tracking-tight bg-gradient-to-r from-slate-900 via-brand-orange to-brand-pink bg-clip-text text-transparent">
                  CRAVO
                </span>
                <span className="text-[10px] font-bold text-slate-400 -mt-1 tracking-widest uppercase">
                  Mood • Budget • AI
                </span>
              </div>
            </a>

            {/* Location selector */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-100/70 hover:bg-slate-200/60 transition-colors text-xs font-semibold text-slate-700 border border-slate-200/50"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span className="max-w-[140px] truncate">{currentLocation}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLocationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50"
                  >
                    <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Delivery Hub
                    </div>
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc}
                        onClick={() => {
                          setCurrentLocation(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                          currentLocation === loc ? 'bg-orange-50 text-brand-orange font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {loc}
                        {currentLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && !isActive && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative"
              aria-label="Search dishes"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-pink text-white font-bold text-sm shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-950 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartItemCount > 0 ? `₹${cartTotal}` : 'Cart'}
              </span>
            </button>

            {/* Profile Avatar / Link */}
            <a
              href="/profile"
              className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-orange/30"
              />
              <div className="hidden xl:flex flex-col text-left pr-2">
                <span className="text-xs font-bold text-slate-800 leading-tight">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] font-semibold text-brand-orange flex items-center gap-0.5">
                  <Award className="w-3 h-3" /> {user.loyaltyPoints} pts
                </span>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search dishes (e.g. Biryani, Vada Pav, Schezwan, Salad, Brownie)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-base font-medium outline-none text-slate-800 placeholder-slate-400"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions or Results */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                {searchQuery.trim() === '' ? (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {['Misal Pav', 'Hyderabadi Biryani', 'Hakka Noodles', 'Butter Chicken', 'Under ₹100', 'High Protein'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-brand-orange text-xs font-semibold text-slate-600 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm font-medium">No dishes found matching &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  searchResults.map(dish => (
                    <div
                      key={dish.id}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setPreviewFood(dish); setIsSearchOpen(false); }}>
                        <img src={dish.image} alt={dish.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <h4 className="text-sm font-bold text-slate-900">{dish.name}</h4>
                          </div>
                          <p className="text-xs text-slate-500">{dish.cuisine} • {dish.deliveryTime} mins</p>
                          <span className="text-sm font-black text-brand-orange">₹{dish.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          addToCart(dish);
                          setIsSearchOpen(false);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-brand-orange text-white text-xs font-bold transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

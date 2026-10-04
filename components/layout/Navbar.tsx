'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-slate-100/80 transition-all pt-safe">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-orange via-brand-pink to-brand-purple flex items-center justify-center shadow-lg shadow-brand-orange/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black font-display tracking-tight bg-gradient-to-r from-slate-900 via-brand-orange to-brand-pink bg-clip-text text-transparent">
                  CRAVO
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 -mt-1 tracking-widest uppercase hidden xs:inline">
                  Mood • Budget • AI
                </span>
              </div>
            </Link>

            {/* Location selector (Responsive for both mobile & desktop) */}
            <div className="relative">
              <button 
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 transition-colors text-[11px] sm:text-xs font-semibold text-slate-700 border border-slate-200/60"
              >
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-orange shrink-0" />
                <span className="max-w-[85px] sm:max-w-[140px] truncate">{currentLocation.split(',')[0]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
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
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-slate-900 rounded-2xl shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && !isActive && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative cursor-pointer"
              aria-label="Search dishes"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Cart Trigger */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-pink text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-orange/25 hover:shadow-brand-orange/40 transition-all cursor-pointer"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      key={cartItemCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                      className="absolute -top-2.5 -right-2.5 bg-slate-950 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="hidden sm:inline">
                {cartItemCount > 0 ? `₹${cartTotal}` : 'Cart'}
              </span>
            </motion.button>

            {/* Profile Avatar / Link */}
            <Link
              href="/profile"
              className="flex items-center gap-2 p-1 sm:p-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all"
              aria-label="User Profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-2 ring-brand-orange/30"
              />
              <div className="hidden xl:flex flex-col text-left pr-2">
                <span className="text-xs font-bold text-slate-800 leading-tight">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] font-semibold text-brand-orange flex items-center gap-0.5">
                  <Award className="w-3 h-3" /> {user.loyaltyPoints} pts
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search dishes (Biryani, Vada Pav, Noodles, Salad)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-sm sm:text-base font-medium outline-none text-slate-800 placeholder-slate-400"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions or Results */}
              <div className="overflow-y-auto p-4 space-y-2 flex-1">
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
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 gap-3"
                    >
                      <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={() => { setPreviewFood(dish); setIsSearchOpen(false); }}>
                        <img src={dish.image} alt={dish.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{dish.name}</h4>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-500 truncate">{dish.cuisine} • {dish.deliveryTime} mins</p>
                          <span className="text-xs sm:text-sm font-black text-brand-orange">₹{dish.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          addToCart(dish);
                          setIsSearchOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-brand-orange text-white text-xs font-bold transition-colors shrink-0"
                      >
                        + Add
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

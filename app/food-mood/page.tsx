'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MOODS } from '@/data/moods';
import { useApp } from '@/context/AppContext';
import { FoodCard } from '@/components/food/FoodCard';
import { 
  Sparkles, 
  Flame, 
  Filter, 
  Check, 
  Dumbbell, 
  Clock, 
  Coins, 
  Smile, 
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Zap
} from 'lucide-react';
import { Mood, DietaryPreference } from '@/types';

function FoodMoodContent() {
  const searchParams = useSearchParams();
  const initialMoodId = searchParams.get('mood') || 'spicy';
  
  const { foods } = useApp();
  const [selectedMood, setSelectedMood] = useState<Mood>(
    MOODS.find(m => m.id === initialMoodId) || MOODS[1]
  );

  // Filters
  const [dietFilter, setDietFilter] = useState<DietaryPreference>('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
  const [onlyHighProtein, setOnlyHighProtein] = useState<boolean>(false);
  const [onlyFastDelivery, setOnlyFastDelivery] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price-low' | 'price-high' | 'time'>('rating');

  useEffect(() => {
    const moodParam = searchParams.get('mood');
    if (moodParam) {
      const found = MOODS.find(m => m.id === moodParam);
      if (found) setSelectedMood(found);
    }
  }, [searchParams]);

  // Compute matched food items
  const filteredDishes = foods.filter(dish => {
    // 1. Mood association match
    const moodMatch = 
      dish.tags.some(tag => selectedMood.recommendedTags.includes(tag)) ||
      (selectedMood.spiceFilter !== undefined && dish.spiceLevel >= selectedMood.spiceFilter) ||
      (selectedMood.id === 'protein' && dish.protein >= 20) ||
      (selectedMood.id === 'sweet' && dish.category === 'dessert') ||
      (selectedMood.id === 'healthy' && (dish.tags.includes('healthy') || dish.calories <= 450)) ||
      (selectedMood.id === 'cheat' && (dish.tags.includes('cheat') || dish.cuisine === 'Burgers' || dish.cuisine === 'Italian')) ||
      (selectedMood.id === 'light' && (dish.category === 'drinks' || dish.category === 'breakfast' || dish.tags.includes('light'))) ||
      (selectedMood.id === 'comfort' && dish.tags.includes('comfort')) ||
      (selectedMood.id === 'delicious' && (dish.isBestseller || dish.rating >= 4.8));

    if (!moodMatch) return false;

    // 2. Dietary Filter
    if (dietFilter === 'veg' && !dish.isVeg) return false;
    if (dietFilter === 'non-veg' && dish.isVeg) return false;
    if (dietFilter === 'egg' && !dish.isEgg && dish.isVeg) return false;

    // 3. Price Filter
    if (maxPriceFilter && dish.price > maxPriceFilter) return false;

    // 4. High Protein
    if (onlyHighProtein && dish.protein < 20) return false;

    // 5. Fast Delivery (<= 20 mins)
    if (onlyFastDelivery && dish.deliveryTime > 20) return false;

    return true;
  });

  // Sorting
  const sortedDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'time') return a.deliveryTime - b.deliveryTime;
    return b.rating - a.rating;
  });

  return (
    <div data-theme="mood" className="min-h-screen pb-24 relative overflow-hidden">
      
      {/* Dynamic Background Ripple Pulse */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMood.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1.2 }}
          exit={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.8 }}
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl -z-10 bg-gradient-to-tr ${selectedMood.gradientBg} pointer-events-none`}
        />
      </AnimatePresence>

      {/* 1. HERO MOOD DISCOVERY */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-rose-500/10 via-orange-500/5 to-transparent border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-brand-orange text-xs font-black uppercase tracking-wider mb-4 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-brand-orange animate-bounce" />
              <span>SENSORY FOOD MATCHING</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-slate-950 tracking-tight">
              HOW ARE YOU <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-pink via-brand-orange to-red-600 bg-clip-text text-transparent animate-gradient-shift">
                FEELING TODAY?
              </span>
            </h1>
            
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
              &ldquo;Your mood deserves the right food.&rdquo; Tap any mood below to transform your feed.
            </p>
          </div>

          {/* 2. THE 9 INTERACTIVE MOOD CARDS WITH PHYSICS */}
          <div className="mt-8 sm:mt-10 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
            {MOODS.map(mood => {
              const isSelected = selectedMood.id === mood.id;
              return (
                <motion.button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`relative overflow-hidden p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl text-left transition-all duration-300 border select-none ${
                    isSelected 
                      ? `bg-gradient-to-r ${mood.gradientBg} text-white shadow-xl sm:shadow-2xl shadow-orange-500/35 border-transparent ring-2 sm:ring-4 ring-orange-400/40` 
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 shadow-soft'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl sm:text-4xl filter drop-shadow-md select-none">
                      {mood.emoji}
                    </span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md shrink-0"
                      >
                        <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                      </motion.span>
                    )}
                  </div>
                  <h3 className={`mt-1.5 sm:mt-3 text-xs sm:text-base font-extrabold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {mood.name.split(' ')[0]}
                  </h3>
                  <p className={`text-[10px] sm:text-xs mt-0.5 line-clamp-1 hidden sm:block ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {mood.tagline}
                  </p>
                </motion.button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. DYNAMIC MOOD RECOMMENDATION FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Dynamic Header Banner with Shimmer & Scale In */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMood.id}
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`p-5 sm:p-8 rounded-card-lg bg-gradient-to-r ${selectedMood.gradientBg} text-white shadow-2xl mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/20`}
          >
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/80">
                Because you&apos;re feeling &ldquo;{selectedMood.name.toUpperCase()}&rdquo;...
              </span>
              <h2 className="text-xl sm:text-4xl font-black font-display mt-1">
                {selectedMood.heroHeadline}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
                {selectedMood.heroSubheadline}
              </p>
              <span className="text-[11px] sm:text-xs italic text-white/70 block mt-1.5 sm:mt-2 font-medium">
                {selectedMood.quote}
              </span>
            </div>

            <div className="shrink-0 bg-white/20 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl border border-white/30 text-center shadow-lg w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-center">
              <span className="text-2xl sm:text-4xl block sm:mb-1">{selectedMood.emoji}</span>
              <span className="text-xs font-black uppercase tracking-wider">{sortedDishes.length} Matches</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Filters & Sorting Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-soft mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          {/* Diet Filters */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Diet:
            </span>
            
            {[
              { id: 'all', label: 'All' },
              { id: 'veg', label: '🟢 Veg' },
              { id: 'non-veg', label: '🔴 Non-Veg' },
              { id: 'egg', label: '🟡 Egg' },
            ].map(d => (
              <motion.button
                key={d.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDietFilter(d.id as DietaryPreference)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  dietFilter === d.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {d.label}
              </motion.button>
            ))}
          </div>

          {/* Quick Badges Filter & Sort */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMaxPriceFilter(maxPriceFilter === 100 ? null : 100)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors ${
                maxPriceFilter === 100 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💰 ≤₹100
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMaxPriceFilter(maxPriceFilter === 200 ? null : 200)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors ${
                maxPriceFilter === 200 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🎯 ≤₹200
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOnlyHighProtein(!onlyHighProtein)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors ${
                onlyHighProtein ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💪 Protein
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOnlyFastDelivery(!onlyFastDelivery)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors ${
                onlyFastDelivery ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ⚡ &lt;20m
            </motion.button>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-100 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 outline-none border border-slate-200 shadow-xs cursor-pointer"
            >
              <option value="rating">⭐ Top Rated</option>
              <option value="price-low">💸 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="time">⏱️ Fastest Delivery</option>
            </select>
          </div>
        </div>

        {/* Dish Grid with Staggered Motion Entrance */}
        {sortedDishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-soft">
            <div className="text-5xl mb-3">🍲</div>
            <h3 className="text-lg font-bold text-slate-800">No dishes match these exact filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try resetting your price or diet filter to see more dishes for {selectedMood.name}.
            </p>
            <button
              onClick={() => {
                setDietFilter('all');
                setMaxPriceFilter(null);
                setOnlyHighProtein(false);
                setOnlyFastDelivery(false);
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-md hover:scale-105 transition-transform"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {sortedDishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
              >
                <FoodCard food={dish} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </section>

    </div>
  );
}

export default function FoodMoodPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">🍲</div>
      </div>
    }>
      <FoodMoodContent />
    </Suspense>
  );
}

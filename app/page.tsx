'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Smile, 
  Coins, 
  Bot, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Award, 
  Zap, 
  ChevronRight, 
  Filter,
  Dices,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/context/AppContext';
import { FoodCard } from '@/components/food/FoodCard';
import { MOODS } from '@/data/moods';

const FLOATING_FOODS = [
  { emoji: '🍕', delay: 0, x: '8%', y: '15%', size: 'text-5xl' },
  { emoji: '🥟', delay: 1, x: '88%', y: '18%', size: 'text-5xl' },
  { emoji: '🍛', delay: 2, x: '4%', y: '65%', size: 'text-6xl' },
  { emoji: '🥤', delay: 0.5, x: '92%', y: '68%', size: 'text-5xl' },
  { emoji: '🌶️', delay: 1.5, x: '18%', y: '82%', size: 'text-4xl' },
  { emoji: '🍫', delay: 2.5, x: '82%', y: '85%', size: 'text-5xl' },
];

export default function HomePage() {
  const { foods, addToCart, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'spicy' | 'budget' | 'protein' | 'dessert'>('all');
  
  // Craving Roulette Spinner State
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spunDish, setSpunDish] = useState<any | null>(null);

  // Filtered dishes for the home trending showcase
  const trendingDishes = foods.filter(dish => {
    if (activeFilter === 'spicy') return dish.spiceLevel >= 2;
    if (activeFilter === 'budget') return dish.price <= 99;
    if (activeFilter === 'protein') return dish.protein >= 20;
    if (activeFilter === 'dessert') return dish.category === 'dessert';
    return dish.isBestseller || dish.rating >= 4.8;
  }).slice(0, 8);

  const handleSpinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpunDish(null);

    // Dynamic roulette cycle
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * foods.length);
      setSpunDish(foods[randomIdx]);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalDish = foods[Math.floor(Math.random() * foods.length)];
        setSpunDish(finalDish);
        setIsSpinning(false);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.log(e);
        }
        showToast(`🎉 Craving Roulette landed on "${finalDish.name}"!`, 'success');
      }
    }, 100);
  };

  return (
    <div data-theme="home" className="min-h-screen">
      
      {/* 1. HERO SECTION WITH FLOATING FOOD ORBITS */}
      <section className="relative overflow-hidden pt-8 pb-14 md:pt-20 md:pb-28 animated-mesh-bg border-b border-slate-100">
        
        {/* Floating 3D Interactive Food Emojis */}
        {FLOATING_FOODS.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.85, 
              scale: [1, 1.15, 1],
              y: [0, -18, 0],
              rotate: [0, 8, -8, 0]
            }}
            transition={{ 
              duration: 4 + i * 0.5,
              repeat: Infinity, 
              ease: "easeInOut",
              delay: f.delay 
            }}
            whileHover={{ scale: 1.5, rotate: 20 }}
            className={`absolute hidden md:block ${f.size} filter drop-shadow-xl select-none cursor-pointer z-0`}
            style={{ left: f.x, top: f.y }}
            onClick={() => showToast(`Craving ${f.emoji}? Explore our Food Moods! 😋`, 'info')}
          >
            {f.emoji}
          </motion.div>
        ))}

        {/* Ambient Glow Orbs */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse-glow" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-pink/15 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Tagline Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 border border-slate-200/80 shadow-soft text-slate-800 text-[11px] sm:text-sm font-bold mb-4 sm:mb-6 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-brand-orange animate-ping" />
            <span className="bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent uppercase tracking-wider font-extrabold">
              Next-Gen Food Ordering
            </span>
            <span className="text-slate-400 hidden xs:inline">•</span>
            <span className="hidden xs:inline">Zero generic lists</span>
          </motion.div>

          {/* Main Headline with Animated Gradient Shimmer */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]"
          >
            WHAT ARE YOU <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple bg-clip-text text-transparent animate-gradient-shift">
              CRAVING?
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 sm:mt-5 text-sm sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-2"
          >
            Tell us your mood, your budget, or just let AI decide. <br className="hidden sm:inline" />
            Hyper-curated food delivered hot in 25 minutes.
          </motion.p>

          {/* CRAVING ROULETTE / QUICK SPINNER ACTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-6 sm:mt-8 max-w-md mx-auto p-2.5 sm:p-3.5 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-orange-200/70 shadow-xl flex items-center justify-between gap-2 sm:gap-3"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-2 text-left min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-orange to-brand-pink text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-md shrink-0">
                🎰
              </div>
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900 block truncate">Craving Roulette</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate block">
                  {spunDish ? spunDish.name : 'Spin for an instant crave pick'}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSpinRoulette}
              disabled={isSpinning}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-brand-orange text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 active:scale-95"
            >
              {isSpinning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Dices className="w-3.5 h-3.5" />}
              <span>{isSpinning ? 'Rolling...' : 'Spin 🎲'}</span>
            </motion.button>
          </motion.div>

          {/* Quick Mood Pills Carousel directly under hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-3xl mx-auto"
          >
            {MOODS.slice(0, 6).map(mood => (
              <Link
                key={mood.id}
                href={`/food-mood?mood=${mood.id}`}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/80 shadow-soft hover:shadow-glow-orange hover:scale-105 active:scale-95 transition-all text-[11px] sm:text-xs font-bold text-slate-800"
              >
                <span className="text-sm sm:text-base">{mood.emoji}</span>
                <span>{mood.name}</span>
              </Link>
            ))}
          </motion.div>

          {/* 2. THE THREE HUGE INTERACTIVE EXPERIENCE CARDS WITH AURORA GLOWS */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
            
            {/* CARD 1: FOOD MOOD */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="relative overflow-hidden rounded-card-lg p-6 sm:p-8 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 text-white shadow-2xl shadow-orange-500/30 group flex flex-col justify-between min-h-[360px] sm:min-h-[400px] border border-white/20 glow-border-card"
            >
              {/* Background Glow & Floating Food */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-white/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -right-4 -bottom-4 text-8xl sm:text-9xl opacity-20 group-hover:rotate-12 group-hover:scale-125 transition-all duration-500 pointer-events-none select-none">
                🍱
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4 border border-white/30 shadow-xs">
                  <span>🍱 EXPERIENCE 1</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black font-display leading-tight tracking-tight">
                  FOOD MOOD
                </h2>
                <p className="mt-2 text-white/90 text-xs sm:text-base font-medium leading-relaxed">
                  &ldquo;Eat what your mood wants.&rdquo; Fiery, comforting, sweet, or clean — match your exact vibe with handpicked dishes.
                </p>

                {/* Mood Tag Previews */}
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-black/25 text-[11px] sm:text-xs font-bold backdrop-blur-xs shadow-xs">🌶️ Spicy</span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-black/25 text-[11px] sm:text-xs font-bold backdrop-blur-xs shadow-xs">😴 Comfort</span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-black/25 text-[11px] sm:text-xs font-bold backdrop-blur-xs shadow-xs">💪 Protein</span>
                </div>
              </div>

              <div className="pt-6 sm:pt-8">
                <Link
                  href="/food-mood"
                  className="inline-flex items-center justify-between w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:bg-slate-100 active:scale-[0.98] transition-all"
                >
                  <span>Explore Moods</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* CARD 2: MEALS UNDER ₹100 */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="relative overflow-hidden rounded-card-lg p-6 sm:p-8 bg-gradient-to-br from-amber-400 via-emerald-500 to-blue-600 text-white shadow-2xl shadow-emerald-500/30 group flex flex-col justify-between min-h-[360px] sm:min-h-[400px] border border-white/20 glow-border-card"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-white/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -right-2 top-2 text-8xl sm:text-9xl font-black font-display opacity-15 select-none pointer-events-none">
                ₹100
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/25 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4 border border-white/30 shadow-xs">
                  <span>🎯 EXPERIENCE 2</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl sm:text-4xl font-black font-display leading-tight tracking-tight">
                    UNDER
                  </h2>
                  <span className="text-3xl sm:text-5xl font-black font-display text-amber-200 animate-pulse">
                    ₹100
                  </span>
                </div>
                <p className="mt-2 text-white/90 text-xs sm:text-base font-medium leading-relaxed">
                  &ldquo;Big cravings. Small budget.&rdquo; Smart combos, knapsack meal optimizers, and deals starting at ₹45.
                </p>

                {/* Value Highlights */}
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-slate-950/25 text-[11px] sm:text-xs font-bold backdrop-blur-xs shadow-xs">🥪 ₹45 Sandwich</span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-slate-950/25 text-[11px] sm:text-xs font-bold backdrop-blur-xs shadow-xs">🥤 ₹25 Shikanji</span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-slate-950/25 text-[11px] sm:text-xs font-bold backdrop-blur-xs shadow-xs">🍟 ₹28 Fries</span>
                </div>
              </div>

              <div className="pt-6 sm:pt-8">
                <Link
                  href="/under-100"
                  className="inline-flex items-center justify-between w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-slate-950 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:bg-slate-900 active:scale-[0.98] transition-all"
                >
                  <span>Find Budget Meals</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* CARD 3: AI FOOD PLANNER */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="relative overflow-hidden rounded-card-lg p-6 sm:p-8 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white shadow-2xl shadow-purple-600/30 group flex flex-col justify-between min-h-[360px] sm:min-h-[400px] border border-white/20 glow-border-card"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -right-4 -bottom-4 text-8xl sm:text-9xl opacity-20 group-hover:scale-125 transition-all duration-500 pointer-events-none select-none">
                🧠
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4 border border-white/30 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
                  <span>EXPERIENCE 3</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black font-display leading-tight tracking-tight">
                  AI PLANNER
                </h2>
                <p className="mt-2 text-white/90 text-xs sm:text-base font-medium leading-relaxed">
                  &ldquo;Tell AI what you want. We&apos;ll build your meal.&rdquo; Natural conversation, macro balancing, and deep rationales.
                </p>

                {/* AI Prompts */}
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-black/25 text-[11px] sm:text-xs font-bold backdrop-blur-xs shadow-xs">✨ &ldquo;High protein dinner&rdquo;</span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-black/25 text-[11px] sm:text-xs font-bold backdrop-blur-xs shadow-xs">✨ &ldquo;₹150 spicy bowl&rdquo;</span>
                </div>
              </div>

              <div className="pt-6 sm:pt-8">
                <Link
                  href="/ai-planner"
                  className="inline-flex items-center justify-between w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  <span>Plan My Meal With AI</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. TRENDING CRAVINGS REEL */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-orange uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 animate-bounce" /> Real-time crave index
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
              Trending Near You
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Top-rated authentic dishes ordered right now in your neighborhood.
            </p>
          </div>

          {/* Quick Filter Tabs with smooth layout pill */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: '🔥 All Bestsellers' },
              { id: 'spicy', label: '🌶️ Spicy Hits' },
              { id: 'budget', label: '💰 Under ₹100' },
              { id: 'protein', label: '💪 High Protein' },
              { id: 'dessert', label: '🍫 Sweet Tooth' },
            ].map(tab => {
              const isActive = activeFilter === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`relative px-4 py-2 rounded-2xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="homeFilterPill"
                      className="absolute inset-0 bg-slate-900 rounded-2xl shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    />
                  )}
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Dishes Grid with AnimatePresence & Spring Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trendingDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <FoodCard food={dish} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-pink text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all"
          >
            <span>Explore All 50+ Dishes</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. WHY CRAVO IS NOT YOUR AVERAGE DELIVERY APP */}
      <section className="py-12 sm:py-16 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-orange">
              The Anti-Directory Formula
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display mt-2">
              Decision Fatigue Is Over.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              No endless 20-page menus. We solve the 3 actual questions you ask before ordering food.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div whileHover={{ y: -6 }} className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl sm:text-2xl font-bold">
                🍱
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">1. What is your mood?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose from 9 psychological mood archetypes. Craving spicy Kolhapuri Misal or comforting Dal Khichdi? We surface the exact sensory match instantly.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl sm:text-2xl font-bold">
                🎯
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">2. What is your budget?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select ₹50, ₹75, or ₹100. Our smart knapsack optimizer automatically builds balanced combinations (Main + Drink + Side) without crossing your limit.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl sm:text-2xl font-bold">
                🧠
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">3. Want AI to figure it out?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Type what you want in plain English. The AI analyzes macros, spice levels, portion sizes and explains exactly why the meal was chosen for you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. GAMIFICATION & POINTS BANNER */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-card-lg p-6 sm:p-12 bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> CRAVO Foodie Rewards
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-display">
              Earn +10 Points On Every Bite.
            </h3>
            <p className="text-xs sm:text-sm text-white/90">
              Level up from <strong>Food Explorer</strong> to <strong>Food Master</strong>. Complete the ₹100 budget challenge to earn bonus loyalty badges and unlock free delivery vouchers!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/under-100#challenge"
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all text-center"
            >
              Play ₹100 Challenge 🎮
            </Link>
            <Link
              href="/profile"
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md active:scale-95 transition-all text-center"
            >
              View My Level 🏆
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

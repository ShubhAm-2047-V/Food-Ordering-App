'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { FoodCard } from '@/components/food/FoodCard';
import { generateBudgetCombos } from '@/lib/budget/optimizer';
import { 
  Coins, 
  Sparkles, 
  Trophy, 
  CheckCircle, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Users, 
  Filter, 
  RotateCcw,
  Zap,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodItem, DietaryPreference, BudgetCombo } from '@/types';

export default function Under100Page() {
  const { foods, addToCart, addLoyaltyPoints, showToast } = useApp();

  // Budget Selector State
  const [selectedBudget, setSelectedBudget] = useState<number>(100);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [dietPref, setDietPref] = useState<DietaryPreference>('all');
  const [categoryTab, setCategoryTab] = useState<string>('all');

  // Generated Intelligent Combos
  const combos = useMemo(() => {
    return generateBudgetCombos(selectedBudget * peopleCount, dietPref, categoryTab, peopleCount);
  }, [selectedBudget, peopleCount, dietPref, categoryTab]);

  // Individual Dishes matching the budget and filters
  const individualBudgetDishes = useMemo(() => {
    return foods.filter(dish => {
      if (dish.price > selectedBudget) return false;
      if (dietPref === 'veg' && !dish.isVeg) return false;
      if (dietPref === 'non-veg' && dish.isVeg) return false;
      if (dietPref === 'egg' && !dish.isEgg && dish.isVeg) return false;
      if (categoryTab !== 'all' && dish.category !== categoryTab) return false;
      return true;
    }).sort((a, b) => a.price - b.price);
  }, [foods, selectedBudget, dietPref, categoryTab]);

  // Gamified "Build a Meal Under ₹100" Challenge State
  const challengeBudget = 100;
  const [challengeItems, setChallengeItems] = useState<FoodItem[]>([]);
  const [hasClaimedReward, setHasClaimedReward] = useState<boolean>(false);

  const challengeTotal = challengeItems.reduce((sum, item) => sum + item.price, 0);
  const challengeRemaining = challengeBudget - challengeTotal;

  const handleAddChallengeItem = (dish: FoodItem) => {
    if (challengeTotal + dish.price > challengeBudget) {
      showToast(`Adding "${dish.name}" (₹${dish.price}) exceeds the ₹100 limit!`, 'warning');
      return;
    }
    setChallengeItems(prev => [...prev, dish]);

    // If optimized (e.g. >= ₹85 and <= ₹100)
    if (challengeTotal + dish.price >= 85 && challengeTotal + dish.price <= 100) {
      triggerChallengeWin();
    }
  };

  const handleRemoveChallengeItem = (index: number) => {
    setChallengeItems(prev => prev.filter((_, i) => i !== index));
  };

  const triggerChallengeWin = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }

    if (!hasClaimedReward) {
      addLoyaltyPoints(20, '₹100 Budget Challenge Champion');
      setHasClaimedReward(true);
      showToast('🎉 PERFECT ₹100 MEAL! +20 CRAVO Points Awarded!', 'success');
    }
  };

  const handleOrderAllCombo = (combo: BudgetCombo) => {
    combo.items.forEach(item => {
      addToCart(item, peopleCount);
    });
    showToast(`Added combo "${combo.title}" to cart! 🎯`, 'success');
  };

  const handleOrderChallengeMeal = () => {
    challengeItems.forEach(item => {
      addToCart(item, 1);
    });
    showToast('Added your custom ₹100 Challenge Meal to cart! 🚀', 'success');
  };

  return (
    <div data-theme="under-100" className="min-h-screen pb-24 relative overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="pt-10 pb-16 bg-gradient-to-b from-amber-400/15 via-emerald-500/10 to-transparent border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-4 border border-emerald-200 shadow-xs"
          >
            <Coins className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>MAXIMUM CRAVING • MINIMUM SPEND</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-slate-950 tracking-tight leading-tight">
            GOOD FOOD. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-500 via-emerald-600 to-blue-600 bg-clip-text text-transparent animate-gradient-shift">
              ₹100 MAX.
            </span>
          </h1>

          <p className="mt-3 text-base sm:text-xl text-slate-600 font-medium max-w-xl mx-auto">
            &ldquo;How much can we get you for less than ₹100?&rdquo;
          </p>

          {/* Budget Quick Switcher Buttons with spring animations */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
            {[50, 75, 100, 150, 200].map(amt => (
              <motion.button
                key={amt}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedBudget(amt)}
                className={`px-5 py-3 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-1.5 ${
                  selectedBudget === amt
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/30 scale-105 ring-4 ring-amber-400/50'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 shadow-soft'
                }`}
              >
                <span>₹{amt}</span>
                {amt === 100 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black animate-pulse">
                    DEFAULT
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Party Size & Diet Switchers */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
              <Users className="w-4 h-4 text-brand-orange" />
              <span>People:</span>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setPeopleCount(n)}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${peopleCount === n ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}
                >
                  {n}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
              <Filter className="w-4 h-4 text-emerald-600" />
              {(['all', 'veg', 'non-veg'] as DietaryPreference[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDietPref(d)}
                  className={`px-2 py-0.5 rounded-lg uppercase transition-colors ${dietPref === d ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. SMART BUDGET OPTIMIZER COMBOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 animate-spin" /> Knapsack Multi-Item Bundler
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              Curated ₹{selectedBudget * peopleCount} Combos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Intelligently bundled balanced meals (Main + Drink + Side) tailored for {peopleCount} {peopleCount === 1 ? 'person' : 'people'}.
            </p>
          </div>
        </div>

        {/* Combos Grid with Animated Entry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo, idx) => (
            <motion.div
              key={combo.id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="bg-white rounded-card border-2 border-emerald-200/80 shadow-soft hover:shadow-glow-green p-6 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-black uppercase tracking-wider border border-emerald-200 shadow-xs">
                    {combo.tags[0] || 'Super Value'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Combo #{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 font-display">
                  {combo.title}
                </h3>

                {/* Items in Combo */}
                <div className="mt-4 space-y-2.5">
                  {combo.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</p>
                          <span className="text-[10px] text-slate-400">{item.cuisine}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800 shrink-0">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Combo Price</span>
                    <span className="text-2xl font-black text-slate-900 font-display">₹{combo.actualPrice}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shadow-xs">
                      Save ₹{combo.savings}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleOrderAllCombo(combo)}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Order This Combo
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. GAMIFIED BUDGET CHALLENGE: BUILD A MEAL UNDER ₹100 WITH LIQUID METER */}
      <section id="challenge" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="rounded-card-lg p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden"
        >
          {/* Neon scan beam */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-75 animate-shimmer" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-800 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Trophy className="w-3.5 h-3.5 animate-bounce" /> GAMIFIED BUDGET ARENA
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-display">
                Can You Build a Meal Under ₹100?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Add snacks, drinks and desserts below. Build an optimized meal between ₹85 and ₹100 to earn <strong>+20 CRAVO loyalty points</strong>!
              </p>
            </div>

            {/* Live Animated Liquid Budget Meter */}
            <div className="w-full lg:w-80 bg-slate-800/90 p-5 rounded-2xl border border-slate-700 shadow-xl">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>Budget: <strong className="text-amber-400">₹{challengeBudget}</strong></span>
                <span>Selected: <strong className="text-emerald-400">₹{challengeTotal}</strong></span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full h-4 bg-slate-700/80 rounded-full overflow-hidden my-2.5 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (challengeTotal / challengeBudget) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`h-full rounded-full transition-colors ${
                    challengeTotal > challengeBudget 
                      ? 'bg-rose-500' 
                      : challengeTotal >= 85 
                        ? 'bg-gradient-to-r from-emerald-400 to-amber-300 animate-pulse' 
                        : 'bg-gradient-to-r from-emerald-500 to-amber-400'
                  }`}
                />
              </div>

              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>Remaining: <strong className="text-amber-300">₹{challengeRemaining}</strong></span>
                <span>{challengeItems.length} items selected</span>
              </div>
            </div>
          </div>

          {/* Selected Challenge Items Pill Bar */}
          <div className="py-6 flex flex-wrap items-center gap-3 relative z-10">
            {challengeItems.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No items added yet. Click &ldquo;+ Add to ₹100 Challenge&rdquo; on any budget dish below!</p>
            ) : (
              challengeItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 text-xs font-bold shadow-md"
                >
                  <span>{item.name}</span>
                  <span className="text-emerald-400">₹{item.price}</span>
                  <button
                    onClick={() => handleRemoveChallengeItem(idx)}
                    className="text-slate-400 hover:text-rose-400 text-sm font-black pl-1"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* Challenge Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 relative z-10">
            <div className="flex items-center gap-3">
              {challengeTotal >= 85 && challengeTotal <= 100 && (
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 animate-bounce">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Perfect ₹100 Meal Built! Reward Unlocked!
                </span>
              )}
              {challengeItems.length > 0 && (
                <button
                  onClick={() => setChallengeItems([])}
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Challenge
                </button>
              )}
            </div>

            {challengeItems.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOrderChallengeMeal}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/30 transition-all"
              >
                Add My ₹{challengeTotal} Meal to Cart 🛒
              </motion.button>
            )}
          </div>
        </motion.div>
      </section>

      {/* 4. BUDGET DISH CATALOG WITH FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              All Dishes Under ₹{selectedBudget}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Affordable street snacks, chai combos, rolls and bowls.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'breakfast', label: '🍳 Breakfast' },
              { id: 'snacks', label: '🥪 Snacks' },
              { id: 'drinks', label: '🥤 Drinks' },
              { id: 'dessert', label: '🍫 Desserts' },
              { id: 'lunch', label: '🍛 Lunch' },
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  categoryTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Dishes Grid with Secondary Challenge Attachment Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {individualBudgetDishes.map(dish => (
            <div key={dish.id} className="flex flex-col">
              <FoodCard food={dish} />
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddChallengeItem(dish)}
                className="mt-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors border border-emerald-200 flex items-center justify-center gap-1 shadow-xs"
              >
                <Plus className="w-3 h-3 text-emerald-600" /> Add to ₹100 Challenge
              </motion.button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Award, 
  Heart, 
  MapPin, 
  Settings, 
  Sparkles, 
  Coins, 
  Flame, 
  Smile, 
  Dumbbell, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { MOODS } from '@/data/moods';
import { DietaryPreference } from '@/types';
import { FoodCard } from '@/components/food/FoodCard';

export default function ProfilePage() {
  const { user, updateUserProfile, foods, orders, toggleFavoriteMood } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'addresses' | 'rewards'>('overview');

  const favoriteDishes = foods.filter(f => user.favoriteFoodIds.includes(f.id));

  // Level progression
  const levels = [
    { name: 'Food Explorer', min: 0, icon: '🍔' },
    { name: 'Food Lover', min: 100, icon: '🍕' },
    { name: 'Food Hunter', min: 250, icon: '🔥' },
    { name: 'Food Master', min: 500, icon: '👑' },
  ];

  const currentLevelIndex = levels.findIndex(l => l.name === user.loyaltyLevel);
  const nextLevel = levels[currentLevelIndex + 1] || null;
  const progressToNext = nextLevel 
    ? Math.min(100, ((user.loyaltyPoints - levels[currentLevelIndex].min) / (nextLevel.min - levels[currentLevelIndex].min)) * 100)
    : 100;

  return (
    <div className="min-h-screen py-10 pb-24 bg-brand-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. PROFILE BANNER */}
        <div className="bg-white rounded-card-lg p-6 sm:p-8 border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-orange-100 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 text-2xl filter drop-shadow">
                {levels[currentLevelIndex].icon}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black font-display text-slate-900">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-brand-orange text-[10px] font-black uppercase">
                  {user.loyaltyLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{user.email} • {user.phone}</p>
              
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs font-semibold text-slate-600">
                <span>📦 {orders.length} Orders</span>
                <span>⭐ {user.loyaltyPoints} CRAVO Points</span>
                <span>❤️ {user.favoriteFoodIds.length} Saved Foods</span>
              </div>
            </div>
          </div>

          {/* Gamification Points Badge */}
          <div className="w-full md:w-64 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Award className="w-4 h-4" /> {user.loyaltyPoints} Points
              </span>
              <span className="text-[10px] text-slate-400">
                {nextLevel ? `Next: ${nextLevel.name}` : 'Max Level'}
              </span>
            </div>

            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-brand-orange to-brand-pink rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>

            <span className="text-[10px] text-slate-400">
              {nextLevel ? `Earn ${nextLevel.min - user.loyaltyPoints} more points to level up` : 'You are a certified Food Master!'}
            </span>
          </div>
        </div>

        {/* 2. TAB CONTROLS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: '⚙️ Preferences & Diet' },
            { id: 'favorites', label: '❤️ Favorite Dishes' },
            { id: 'rewards', label: '🏆 Rewards & Levels' },
            { id: 'addresses', label: '📍 Saved Addresses' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. TAB PANELS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Diet & Budget Preference */}
            <div className="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Dietary Style</h3>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: '🍽️ All Cuisines' },
                  { id: 'veg', label: '🥗 Pure Vegetarian' },
                  { id: 'non-veg', label: '🍗 Non-Vegetarian' },
                  { id: 'egg', label: '🥚 Eggetarian' },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => updateUserProfile({ dietPreference: d.id as DietaryPreference })}
                    className={`p-3 rounded-2xl text-left text-xs font-bold border-2 transition-all ${
                      user.dietPreference === d.id
                        ? 'border-brand-orange bg-orange-50 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Default Budget Goal</h4>
                <div className="flex items-center gap-2">
                  {[100, 150, 200, 300].map(b => (
                    <button
                      key={b}
                      onClick={() => updateUserProfile({ budgetPreference: b })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        user.budgetPreference === b ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      ₹{b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Favorite Food Moods */}
            <div className="bg-white p-6 rounded-card border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Favorite Food Moods</h3>
              <p className="text-xs text-slate-500">Tap to toggle your go-to mood archetypes.</p>

              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => {
                  const isFav = user.favoriteMoods.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleFavoriteMood(m.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isFav
                          ? 'bg-rose-50 border-brand-pink text-brand-pink shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {favoriteDishes.length === 0 ? (
              <div className="bg-white rounded-card p-12 text-center border border-slate-200">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-800">No favorite dishes yet</h4>
                <p className="text-xs text-slate-500 mt-1">Tap the heart icon on any food card to bookmark it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteDishes.map(dish => (
                  <FoodCard key={dish.id} food={dish} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levels.map((lvl, idx) => (
              <div
                key={lvl.name}
                className={`p-6 rounded-3xl border-2 transition-all ${
                  user.loyaltyLevel === lvl.name
                    ? 'border-brand-orange bg-orange-50/50 shadow-md'
                    : 'border-slate-200 bg-white opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{lvl.icon}</span>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{lvl.name}</h4>
                    <span className="text-xs text-slate-500 font-bold">{lvl.min}+ Points required</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {idx === 0 && 'Earn +10 points on orders, unlock basic promotions.'}
                  {idx === 1 && 'Unlock 10% bonus discounts and free delivery coupons on weekends.'}
                  {idx === 2 && 'Priority kitchen dispatch and exclusive chef tastings.'}
                  {idx === 3 && 'Lifetime free delivery threshold and VIP concierge service.'}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.savedAddresses.map(addr => (
              <div key={addr.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-xs font-black uppercase text-brand-orange block mb-1">{addr.tag}</span>
                <p className="text-xs font-semibold text-slate-700">{addr.address}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

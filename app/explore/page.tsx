'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FoodCard } from '@/components/food/FoodCard';
import { 
  Flame, 
  Sparkles, 
  Coins, 
  Award, 
  Home, 
  Star, 
  MapPin, 
  Clock, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { Restaurant } from '@/types';

export default function ExplorePage() {
  const { foods, restaurants, setPreviewFood } = useApp();
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const cuisinesList = [
    'all',
    'Street Food',
    'Biryani',
    'Healthy',
    'Chinese',
    'South Indian',
    'North Indian',
    'Italian',
    'Desserts',
    'Burgers',
    'Homestyle'
  ];

  // Sections
  const trendingDishes = foods.filter(f => f.isBestseller || f.rating >= 4.8);
  const hiddenGems = foods.filter(f => f.rating >= 4.8 && f.price <= 90);
  const under100Picks = foods.filter(f => f.price <= 100);
  const spicyPicks = foods.filter(f => f.spiceLevel >= 2);
  const healthyPicks = foods.filter(f => f.tags.includes('healthy') || f.protein >= 25);
  const homemadePicks = foods.filter(f => f.restaurantId === 'rest-12' || f.tags.includes('homestyle'));

  const filteredRestaurants = selectedCuisine === 'all' 
    ? restaurants 
    : restaurants.filter(r => r.cuisines.some(c => c.toLowerCase() === selectedCuisine.toLowerCase()));

  return (
    <div className="min-h-screen pb-24 bg-brand-light">
      
      {/* 1. HERO HEADER */}
      <section className="pt-10 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>HYPERLOCAL FOOD DISCOVERY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-950 tracking-tight">
              Explore Cravings & Kitchens
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Curated street carts, cloud kitchens and artisanal bistros in your delivery radius.
            </p>
          </div>

          {/* Cuisine Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {cuisinesList.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 capitalize ${
                  selectedCuisine === c
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {c === 'all' ? '🍽️ All Cuisines' : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. VERIFIED KITCHENS HORIZONTAL REEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
              Partner Kitchens & Bistros ({filteredRestaurants.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map(rest => (
            <div
              key={rest.id}
              className="bg-white rounded-card overflow-hidden border border-slate-100 shadow-soft hover:shadow-premium transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{rest.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span>{rest.deliveryTimeMin}-{rest.deliveryTimeMax} min</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-brand-orange transition-colors">
                    {rest.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{rest.tagline}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rest.cuisines.map(c => (
                      <span key={c} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange" /> {rest.location.split(',')[0]}
                  </span>
                  <span className="font-bold text-slate-800">Min: ₹{rest.minOrder}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED FOOD LANES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-8">
        
        {/* Lane 1: 🔥 Trending Near You */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">Trending Near You</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDishes.slice(0, 4).map(dish => (
              <FoodCard key={dish.id} food={dish} />
            ))}
          </div>
        </section>

        {/* Lane 2: 💎 Hidden Gems Under ₹90 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">Hidden Gems Under ₹90</h2>
            </div>
            <Link href="/under-100" className="text-xs font-bold text-brand-orange hover:underline">View All &gt;</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hiddenGems.slice(0, 4).map(dish => (
              <FoodCard key={dish.id} food={dish} />
            ))}
          </div>
        </section>

        {/* Lane 3: 🌶️ Spicy Picks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">Bold &amp; Spicy Hits</h2>
            </div>
            <Link href="/food-mood?mood=spicy" className="text-xs font-bold text-brand-orange hover:underline">Explore Spicy &gt;</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spicyPicks.slice(0, 4).map(dish => (
              <FoodCard key={dish.id} food={dish} />
            ))}
          </div>
        </section>

        {/* Lane 4: 🏠 Homemade & Homestyle Comfort */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">Maa Ki Rasoi &amp; Homemade Comfort</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homemadePicks.slice(0, 4).map(dish => (
              <FoodCard key={dish.id} food={dish} />
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}

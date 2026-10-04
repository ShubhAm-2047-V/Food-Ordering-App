'use client';

import React, { useState } from 'react';
import { FoodItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { Plus, Minus, Star, Clock, Flame, Dumbbell, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FoodCardProps {
  food: FoodItem;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function FoodCard({ food, variant = 'default' }: FoodCardProps) {
  const { cart, addToCart, updateCartQuantity, setPreviewFood, user, toggleFavoriteFood } = useApp();
  const [flyingParticles, setFlyingParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const cartItem = cart.find(item => item.food.id === food.id);
  const quantity = cartItem?.quantity || 0;
  const isFavorite = user.favoriteFoodIds.includes(food.id);

  const handleAddWithFlyEffect = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(food);

    // Spawn flying particle
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newParticle = {
      id: Date.now(),
      x: rect.left,
      y: rect.top,
    };
    setFlyingParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setFlyingParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 850);
  };

  if (variant === 'horizontal') {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-premium transition-all duration-300 relative group overflow-hidden"
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-1.5 left-1.5">
            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center bg-white/90 shadow-xs ${food.isVeg ? 'border border-emerald-600' : 'border border-rose-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-orange transition-colors">{food.name}</h4>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{food.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-black text-slate-900 font-display">₹{food.price}</span>
            {food.originalPrice && (
              <span className="text-xs text-slate-400 line-through">₹{food.originalPrice}</span>
            )}
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-0.5">
              <Clock className="w-3 h-3 text-slate-400" /> {food.deliveryTime}m
            </span>
          </div>
        </div>

        <div className="shrink-0">
          {quantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.08 }}
              onClick={handleAddWithFlyEffect}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-brand-orange text-brand-orange hover:text-white text-xs font-bold transition-all shadow-xs border border-orange-200"
            >
              Add +
            </motion.button>
          ) : (
            <div className="flex items-center bg-slate-900 text-white rounded-xl p-0.5 shadow-md">
              <button onClick={() => updateCartQuantity(food.id, quantity - 1)} className="p-1 hover:text-brand-orange"><Minus className="w-3.5 h-3.5" /></button>
              <span className="px-2 text-xs font-bold">{quantity}</span>
              <button onClick={() => updateCartQuantity(food.id, quantity + 1)} className="p-1 hover:text-brand-orange"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="bg-white rounded-card border border-slate-100/90 shadow-soft hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group relative"
    >
      {/* Flying Particle Layer */}
      {flyingParticles.map(p => (
        <span
          key={p.id}
          className="fixed z-50 pointer-events-none text-2xl filter drop-shadow-lg flying-cart-emoji"
          style={{ left: p.x, top: p.y }}
        >
          🍲
        </span>
      ))}

      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setPreviewFood(food)}>
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-0.5 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {/* Veg / Non-Veg Indicator */}
            <span className={`w-5 h-5 rounded-md flex items-center justify-center bg-white shadow-md ${food.isVeg ? 'border-2 border-emerald-600' : 'border-2 border-rose-600'}`}>
              <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            </span>

            {/* Bestseller Badge with Shimmer */}
            {food.isBestseller && (
              <span className="shimmer-effect bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-slate-900" /> Bestseller
              </span>
            )}
          </div>

          {/* Favorite Toggle with Heart Pulse */}
          <motion.button
            whileTap={{ scale: 0.7 }}
            whileHover={{ scale: 1.15 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteFood(food.id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-600 hover:text-brand-pink transition-colors"
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-brand-pink text-brand-pink scale-110' : ''}`} />
          </motion.button>
        </div>

        {/* Bottom Image Stats */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold z-10">
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{food.rating}</span>
            <span className="text-slate-300 text-[10px]">({food.ratingCount})</span>
          </span>

          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shadow-xs">
            <Clock className="w-3 h-3 text-slate-300" />
            <span>{food.deliveryTime} mins</span>
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags / Spice / Protein pills */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5 sm:mb-2">
            {food.protein >= 20 && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border border-blue-100 shadow-xs">
                <Dumbbell className="w-3 h-3 text-blue-600" /> {food.protein}g Protein
              </span>
            )}

            {food.spiceLevel > 0 && (
              <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-600 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-rose-100 shadow-xs">
                {Array.from({ length: food.spiceLevel }).map((_, i) => (
                  <Flame key={i} className="w-3 h-3 fill-rose-500 text-rose-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </span>
            )}

            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 px-1 py-0.5">
              {food.calories} kcal
            </span>
          </div>

          <h3 
            onClick={() => setPreviewFood(food)}
            className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-brand-orange transition-colors cursor-pointer line-clamp-1"
          >
            {food.name}
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 font-display">₹{food.price}</span>
              {food.originalPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">₹{food.originalPrice}</span>
              )}
            </div>
            {food.originalPrice && (
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 block">
                Save ₹{food.originalPrice - food.price}
              </span>
            )}
          </div>

          {/* Interactive Quantity / Add Button with Magnetic Bounce */}
          {quantity === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.90 }}
              onClick={handleAddWithFlyEffect}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-pink text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="flex items-center bg-slate-900 text-white rounded-xl shadow-md p-0.5"
            >
              <button
                onClick={() => updateCartQuantity(food.id, quantity - 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white transition-colors active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-black text-xs font-display">{quantity}</span>
              <button
                onClick={() => updateCartQuantity(food.id, quantity + 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-800 text-slate-300 hover:text-white transition-colors active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

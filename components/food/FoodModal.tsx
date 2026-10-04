'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Flame, Dumbbell, ShieldCheck, Heart, Plus, Minus, ChefHat } from 'lucide-react';

export function FoodModal() {
  const { previewFood, setPreviewFood, addToCart, cart, updateCartQuantity, user, toggleFavoriteFood } = useApp();

  if (!previewFood) return null;

  const cartItem = cart.find(item => item.food.id === previewFood.id);
  const quantity = cartItem?.quantity || 0;
  const isFavorite = user.favoriteFoodIds.includes(previewFood.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header Image */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0">
            <img
              src={previewFood.image}
              alt={previewFood.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Close Button */}
            <button
              onClick={() => setPreviewFood(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavoriteFood(previewFood.id)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-colors"
              aria-label="Toggle favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-brand-pink text-brand-pink' : 'text-white'}`} />
            </button>

            {/* Dish Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-4 h-4 rounded flex items-center justify-center bg-white ${previewFood.isVeg ? 'border border-emerald-600' : 'border border-rose-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${previewFood.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">{previewFood.cuisine} Cuisine</span>
              </div>
              <h2 className="text-2xl font-black font-display">{previewFood.name}</h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-5">
            <p className="text-sm text-slate-600 leading-relaxed">{previewFood.description}</p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rating</span>
                <p className="text-sm font-black text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {previewFood.rating}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Protein</span>
                <p className="text-sm font-black text-blue-600 flex items-center justify-center gap-1 mt-0.5">
                  <Dumbbell className="w-3.5 h-3.5" /> {previewFood.protein}g
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Calories</span>
                <p className="text-sm font-black text-slate-800 mt-0.5">{previewFood.calories} kcal</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Spice</span>
                <p className="text-sm font-black text-rose-600 flex items-center justify-center gap-0.5 mt-0.5">
                  {previewFood.spiceLevel === 0 ? 'Mild' : Array.from({ length: previewFood.spiceLevel }).map((_, i) => (
                    <Flame key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  ))}
                </p>
              </div>
            </div>

            {/* Chef Notes & Quality Assurance */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60">
              <ChefHat className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Crafted Fresh On Order</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Prepared with 100% farm-fresh spices and zero artificial additives. Estimated cooking time ~{previewFood.deliveryTime} mins.
                </p>
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="flex flex-wrap gap-2">
              {previewFood.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold block">TOTAL PRICE</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-display">₹{previewFood.price}</span>
                {previewFood.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">₹{previewFood.originalPrice}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {quantity === 0 ? (
                <button
                  onClick={() => addToCart(previewFood)}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-brand-orange text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Add to Cart +
                </button>
              ) : (
                <div className="flex items-center bg-slate-900 text-white rounded-2xl p-1 shadow-md">
                  <button onClick={() => updateCartQuantity(previewFood.id, quantity - 1)} className="p-2 hover:text-brand-orange"><Minus className="w-4 h-4" /></button>
                  <span className="px-3 font-black text-sm">{quantity}</span>
                  <button onClick={() => updateCartQuantity(previewFood.id, quantity + 1)} className="p-2 hover:text-brand-orange"><Plus className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

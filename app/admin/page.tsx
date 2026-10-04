'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Store, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Layers, 
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { FoodItem, Restaurant, OrderStatus } from '@/types';

export default function AdminPage() {
  const {
    foods,
    restaurants,
    orders,
    coupons,
    addRestaurant,
    deleteRestaurant,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    updateOrderStatus,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'foods' | 'orders' | 'coupons'>('overview');

  // New Restaurant Form State
  const [newRestName, setNewRestName] = useState('');
  const [newRestTagline, setNewRestTagline] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('Street Food');
  const [newRestLocation, setNewRestLocation] = useState('Indiranagar, Bengaluru');
  const [newRestMinOrder, setNewRestMinOrder] = useState('50');

  // New Food Item Form State
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState('99');
  const [newFoodCategory, setNewFoodCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'drinks' | 'dessert'>('lunch');
  const [newFoodIsVeg, setNewFoodIsVeg] = useState(true);
  const [newFoodProtein, setNewFoodProtein] = useState('15');
  const [newFoodCalories, setNewFoodCalories] = useState('350');
  const [newFoodSpice, setNewFoodSpice] = useState<'0' | '1' | '2' | '3'>('1');
  const [newFoodRestId, setNewFoodRestId] = useState(restaurants[0]?.id || 'rest-1');

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 18450;
  const totalOrdersCount = orders.length + 142;
  const avgOrderValue = Math.round(totalRevenue / totalOrdersCount);

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName) return;

    const newRest: Restaurant = {
      id: `rest-${Date.now()}`,
      name: newRestName,
      tagline: newRestTagline || 'Authentic Craving Kitchen',
      description: 'Newly added cloud kitchen with verified hygiene standards.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      location: newRestLocation,
      distanceKm: 1.5,
      rating: 4.8,
      ratingCount: 12,
      deliveryTimeMin: 20,
      deliveryTimeMax: 30,
      minOrder: Number(newRestMinOrder) || 50,
      cuisines: [newRestCuisine],
      isOpen: true,
      tags: ['new', 'delicious']
    };

    addRestaurant(newRest);
    setNewRestName('');
    setNewRestTagline('');
  };

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName) return;

    const newFood: FoodItem = {
      id: `food-${Date.now()}`,
      restaurantId: newFoodRestId,
      name: newFoodName,
      description: 'Delicious fresh prepared dish with quality ingredients.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      price: Number(newFoodPrice) || 99,
      category: newFoodCategory,
      cuisine: 'Indian Fusion',
      isVeg: newFoodIsVeg,
      calories: Number(newFoodCalories) || 350,
      protein: Number(newFoodProtein) || 12,
      spiceLevel: Number(newFoodSpice) as any,
      deliveryTime: 20,
      rating: 4.9,
      ratingCount: 1,
      tags: ['new', 'delicious', newFoodPrice <= '100' ? 'budget' : 'gourmet']
    };

    addFoodItem(newFood);
    setNewFoodName('');
  };

  return (
    <div className="min-h-screen py-10 pb-24 bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/30">
              <span>⚡ CRAVO CONTROL TOWER</span>
            </div>
            <h1 className="text-3xl font-black font-display text-white">
              Admin &amp; Operations Portal
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: '📊 Dashboard' },
              { id: 'orders', label: '📦 Orders' },
              { id: 'foods', label: '🍲 Dishes' },
              { id: 'restaurants', label: '🏪 Kitchens' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-brand-orange text-white shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. OVERVIEW / METRICS DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Gross Revenue</span>
                <h3 className="text-3xl font-black font-display text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                <span className="text-[11px] font-semibold text-emerald-500">↑ 18.4% this week</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
                <h3 className="text-3xl font-black font-display text-cyan-400">{totalOrdersCount}</h3>
                <span className="text-[11px] font-semibold text-cyan-500">~24 mins avg dispatch</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Avg Order Value</span>
                <h3 className="text-3xl font-black font-display text-amber-400">₹{avgOrderValue}</h3>
                <span className="text-[11px] font-semibold text-amber-500">Optimized by ₹100 Combos</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Kitchens</span>
                <h3 className="text-3xl font-black font-display text-pink-400">{restaurants.length}</h3>
                <span className="text-[11px] font-semibold text-slate-400">{foods.length} active live dishes</span>
              </div>

            </div>

            {/* Popular Breakdown Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                <h3 className="text-base font-bold text-white">Experience Traffic Distribution</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>🍱 Food Mood Discovery</span>
                      <span className="font-bold text-brand-pink">42%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-[42%] h-full bg-brand-pink rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>🎯 Meals Under ₹100 Optimizer</span>
                      <span className="font-bold text-amber-400">36%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-[36%] h-full bg-amber-400 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>🧠 AI Food Planner Conversations</span>
                      <span className="font-bold text-cyan-400">22%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-[22%] h-full bg-cyan-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                <h3 className="text-base font-bold text-white">Top Craving Archetypes</h3>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    🌶️ I Want Spicy (34%)
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    😴 Comfort Food (28%)
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                    💪 High Protein (21%)
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
                    🍫 Sweet Cravings (17%)
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Live Customer Orders ({orders.length})</h3>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-400">No customer orders placed in this session yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-amber-400">ORDER #{order.id}</span>
                        <span className="text-xs font-semibold text-slate-400">• ₹{order.total}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {order.items.map(i => `${i.quantity}x ${i.food.name}`).join(', ')}
                      </p>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{order.deliveryAddress.street}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-white border border-slate-600 outline-none"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="on_the_way">On The Way</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. DISHES CRUD */}
        {activeTab === 'foods' && (
          <div className="space-y-8">
            {/* Create Dish Form */}
            <form onSubmit={handleCreateFood} className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-orange" /> Add New Dish Item
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schezwan Fried Rice"
                    value={newFoodName}
                    onChange={(e) => setNewFoodName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newFoodPrice}
                    onChange={(e) => setNewFoodPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Category</label>
                  <select
                    value={newFoodCategory}
                    onChange={(e) => setNewFoodCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none"
                  >
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="snacks">Snacks</option>
                    <option value="drinks">Drinks</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFoodIsVeg}
                    onChange={(e) => setNewFoodIsVeg(e.target.checked)}
                    className="rounded"
                  />
                  <span>Pure Vegetarian</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Save Dish
                </button>
              </div>
            </form>

            {/* Dishes Catalog List */}
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-white">Manage Existing Dishes ({foods.length})</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                {foods.map(dish => (
                  <div key={dish.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-3">
                    <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{dish.name}</h4>
                      <span className="text-xs font-black text-amber-400">₹{dish.price}</span>
                    </div>
                    <button
                      onClick={() => deleteFoodItem(dish.id)}
                      className="p-2 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. RESTAURANTS CRUD */}
        {activeTab === 'restaurants' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateRestaurant} className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-orange" /> Register New Partner Kitchen
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Kitchen Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Nawabi Darbar"
                    value={newRestName}
                    onChange={(e) => setNewRestName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Cuisine</label>
                  <input
                    type="text"
                    required
                    value={newRestCuisine}
                    onChange={(e) => setNewRestCuisine(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Location Hub</label>
                  <input
                    type="text"
                    required
                    value={newRestLocation}
                    onChange={(e) => setNewRestLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider"
              >
                Create Restaurant
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {restaurants.map(rest => (
                <div key={rest.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rest.image} alt={rest.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{rest.name}</h4>
                      <span className="text-xs text-slate-400">{rest.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRestaurant(rest.id)}
                    className="p-2 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

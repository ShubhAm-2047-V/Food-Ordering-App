'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { generateAIRecommendation } from '@/lib/ai/planner';
import { FoodCard } from '@/components/food/FoodCard';
import { 
  Bot, 
  Sparkles, 
  Mic, 
  Send, 
  RefreshCw, 
  Dumbbell, 
  Clock, 
  Flame, 
  ShoppingBag, 
  CheckCircle2, 
  Shuffle, 
  MessageSquare, 
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodItem, AIRecommendationResult, DietaryPreference } from '@/types';

export default function AIPlannerPage() {
  const { addToCart, showToast } = useApp();

  // Chat / Query State
  const [queryInput, setQueryInput] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Conversational Parameter State
  const [budget, setBudget] = useState<number>(200);
  const [diet, setDiet] = useState<DietaryPreference>('all');
  const [spiceLevel, setSpiceLevel] = useState<number>(2);
  const [partySize, setPartySize] = useState<number>(1);
  const [isHighProtein, setIsHighProtein] = useState<boolean>(false);

  // Active AI Recommendation
  const [recommendation, setRecommendation] = useState<AIRecommendationResult | null>(null);

  // Generate initial recommendation on mount
  useEffect(() => {
    runAIPlanner('I want something tasty and filling under ₹200');
  }, []);

  const runAIPlanner = (customQuery?: string) => {
    setIsThinking(true);
    const q = customQuery !== undefined ? customQuery : queryInput;

    setTimeout(() => {
      const res = generateAIRecommendation({
        query: q,
        budget,
        diet,
        spiceLevel,
        partySize,
        isHighProtein
      });
      setRecommendation(res);
      setIsThinking(false);
    }, 750);
  };

  const handleQuickPrompt = (prompt: string) => {
    setQueryInput(prompt);
    
    // Auto adjust settings based on prompt
    if (prompt.includes('budget')) setBudget(100);
    if (prompt.includes('healthy')) setBudget(180);
    if (prompt.includes('protein')) setIsHighProtein(true);
    if (prompt.includes('spicy')) setSpiceLevel(3);
    if (prompt.includes('3 people')) setPartySize(3);

    runAIPlanner(prompt);
  };

  const handleSimulateMic = () => {
    setIsListening(true);
    showToast('🎙️ Listening... Speak your craving!', 'info');
    setTimeout(() => {
      setIsListening(false);
      setQueryInput('I want high protein spicy chicken meal for post workout');
      setIsHighProtein(true);
      setSpiceLevel(3);
      runAIPlanner('I want high protein spicy chicken meal for post workout');
    }, 2000);
  };

  const handleAddAllToCart = () => {
    if (!recommendation) return;
    addToCart(recommendation.primaryDish, partySize);
    if (recommendation.suggestedAddOn) {
      addToCart(recommendation.suggestedAddOn, partySize);
    }
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
    showToast('Added complete AI Recommended Combo to cart! 🧠✨', 'success');
  };

  const handlePickForMe = () => {
    if (!recommendation || recommendation.alternativeDishes.length === 0) return;
    const randomPick = recommendation.alternativeDishes[Math.floor(Math.random() * recommendation.alternativeDishes.length)];
    addToCart(randomPick);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (e) {
      console.log(e);
    }
    showToast(`AI picked "${randomPick.name}" for you! 🎲😋`, 'success');
  };

  return (
    <div data-theme="ai-planner" className="min-h-screen bg-slate-950 text-white pb-24 relative overflow-hidden">
      
      {/* Background Cyber Mesh & Particles */}
      <div className="absolute inset-0 dark-mesh-bg pointer-events-none" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* 1. HERO SECTION WITH CYBER ORB */}
      <section className="relative z-10 pt-12 pb-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Pulsing AI Neural Orb Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-0.5 shadow-glow-cyan mb-4 flex items-center justify-center"
        >
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Bot className="w-8 h-8 text-cyan-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider mb-4 border border-purple-500/30 backdrop-blur-md shadow-xs"
        >
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>AUTONOMOUS FOOD INTELLIGENCE</span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-tight">
          LET AI PLAN <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
            YOUR EXACT MEAL
          </span>
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-medium">
          &ldquo;Tell us what you&apos;re hungry for. We&apos;ll figure out the rest.&rdquo;
        </p>

        {/* 2. CONVERSATIONAL INPUT BAR */}
        <div className="mt-8 max-w-3xl mx-auto">
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative flex items-center bg-slate-900/95 rounded-3xl border-2 border-purple-500/50 p-2 shadow-2xl shadow-purple-950/70 backdrop-blur-xl"
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleSimulateMic}
              className={`p-3 rounded-2xl transition-all ${
                isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Voice Search"
              aria-label="Voice Search"
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            <input
              type="text"
              placeholder="Example: I'm hungry, have ₹200, want high protein and mild spice..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAIPlanner()}
              className="flex-1 bg-transparent px-4 py-2 text-sm sm:text-base font-medium text-white placeholder-slate-400 outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => runAIPlanner()}
              disabled={isThinking}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:opacity-90 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              {isThinking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Quick Prompts with bouncy motion */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Prompts:
            </span>
            {[
              "I'm on a budget",
              "Give me something healthy",
              "I want spicy food",
              "I want high protein",
              "I'm ordering for 3 people",
              "I want dessert"
            ].map(p => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleQuickPrompt(p)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-purple-900/60 hover:text-cyan-300 text-slate-300 border border-slate-700/60 transition-colors shadow-xs"
              >
                ✨ {p}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 3. STEP-BY-STEP FOLLOW UP QUESTIONS */}
        <div className="mt-10 p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-left shadow-xl">
          
          {/* Budget */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">What is your budget?</span>
            <div className="flex items-center gap-1">
              {[100, 200, 300, 500].map(b => (
                <motion.button
                  key={b}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setBudget(b); runAIPlanner(); }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${budget === b ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  ₹{b}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Diet */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Dietary preference?</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'Anything' },
                { id: 'veg', label: '🥗 Veg' },
                { id: 'non-veg', label: '🍗 Non-Veg' },
                { id: 'egg', label: '🥚 Egg' },
              ].map(d => (
                <motion.button
                  key={d.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setDiet(d.id as DietaryPreference); runAIPlanner(); }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${diet === d.id ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  {d.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Spice */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Spice Level?</span>
            <div className="flex items-center gap-1">
              {[
                { level: 0, label: 'Mild' },
                { level: 2, label: 'Medium' },
                { level: 3, label: '🔥 Spicy' },
              ].map(s => (
                <motion.button
                  key={s.level}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSpiceLevel(s.level); runAIPlanner(); }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${spiceLevel === s.level ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  {s.label}
                </motion.button>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* 4. AI FINAL RECOMMENDATION RESULT DECK */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {isThinking ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-slate-900/60 rounded-3xl border border-slate-800 backdrop-blur-md"
          >
            <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-3xl mb-4 animate-bounce">
              🧠
            </div>
            <h3 className="text-xl font-bold text-white">AI is evaluating 50+ fresh dishes...</h3>
            <p className="text-xs text-slate-400 mt-1">Balancing macros, budgets, and cooking time.</p>
          </motion.div>
        ) : recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="space-y-8"
          >
            {/* Primary Recommendation Card with Cyber Glow Border */}
            <div className="rounded-card-lg p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-900 border-2 border-purple-500/50 shadow-2xl shadow-purple-950/80 relative overflow-hidden">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/40">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2 border border-cyan-400/30">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span>AI MATCH SCORE: 98%</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                    {recommendation.headline}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase block">Estimated Delivery</span>
                  <span className="text-base font-black text-cyan-300 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> ~{recommendation.estimatedTime} mins
                  </span>
                </div>
              </div>

              {/* Main Dish & Suggested Add-On Showcase */}
              <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Primary Main Dish */}
                <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 flex items-center gap-4 shadow-lg">
                  <img
                    src={recommendation.primaryDish.image}
                    alt={recommendation.primaryDish.name}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0 ring-2 ring-cyan-400/30"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">PRIMARY DISH</span>
                    <h3 className="text-base font-bold text-white truncate">{recommendation.primaryDish.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{recommendation.primaryDish.cuisine} • {recommendation.primaryDish.protein}g Protein</p>
                    <span className="text-lg font-black text-cyan-300 mt-1 block font-display">₹{recommendation.primaryDish.price}</span>
                  </div>
                </motion.div>

                {/* Suggested Add-On if available */}
                {recommendation.suggestedAddOn ? (
                  <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 flex items-center gap-4 shadow-lg">
                    <img
                      src={recommendation.suggestedAddOn.image}
                      alt={recommendation.suggestedAddOn.name}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0 ring-2 ring-pink-400/30"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider">+ COMPLEMENTARY ADD-ON</span>
                      <h3 className="text-base font-bold text-white truncate">{recommendation.suggestedAddOn.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{recommendation.suggestedAddOn.category} • Refreshing</p>
                      <span className="text-lg font-black text-pink-300 mt-1 block font-display">₹{recommendation.suggestedAddOn.price}</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                    Solo dish optimization within budget
                  </div>
                )}

              </div>

              {/* 5. DEEP AI EXPLANATION */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-300">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Why AI built this combo for you:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  &ldquo;{recommendation.explanation}&rdquo;
                </p>
                
                {/* Rationale Bullet points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {recommendation.reasons.map((r, i) => (
                    <span key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Total & Action Bar */}
              <div className="mt-8 pt-6 border-t border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Price</span>
                    <span className="text-3xl font-black text-white font-display">₹{recommendation.totalPrice}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Nutrition</span>
                    <span className="text-xs font-bold text-cyan-300">
                      💪 {recommendation.totalProtein}g Protein • {recommendation.totalCalories} kcal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => runAIPlanner()}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-Roll
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
                    whileTap={{ scale: 0.94 }}
                    onClick={handleAddAllToCart}
                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add All to Cart
                  </motion.button>
                </div>
              </div>

            </div>

            {/* 6. AI ALTERNATIVES ("NOT FEELING IT?") */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-black uppercase text-pink-400 tracking-wider">NOT FEELING IT?</span>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                    Alternative Smart Matches
                  </h3>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePickForMe}
                  className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-cyan-300 border border-purple-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Pick For Me 🎲
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendation.alternativeDishes.map(alt => (
                  <motion.div
                    key={alt.id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-soft hover:shadow-glow-purple transition-all"
                  >
                    <img src={alt.image} alt={alt.name} className="w-full aspect-[4/3] rounded-xl object-cover mb-3" />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{alt.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{alt.cuisine} • {alt.protein}g protein</p>
                      <span className="text-sm font-black text-cyan-400 mt-1 block font-display">₹{alt.price}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        addToCart(alt);
                        showToast(`Added "${alt.name}" to cart! 😋`, 'success');
                      }}
                      className="mt-3 w-full py-2 rounded-xl bg-slate-800 hover:bg-purple-600 text-white text-xs font-bold transition-colors"
                    >
                      + Add Alternative
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </section>

    </div>
  );
}

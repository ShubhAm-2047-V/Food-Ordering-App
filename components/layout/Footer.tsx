'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Heart, Sparkles, ShieldCheck, Zap, Award, Smartphone } from 'lucide-react';
import { MOODS } from '@/data/moods';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 sm:pt-16 pb-32 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 pb-8 sm:pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500/20 text-brand-orange flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">20-30m Drop</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Hyperlocal delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">AI Food Intel</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Exact meal matching</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% Hygiene</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Verified kitchens</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">CRAVO Points</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Rewards on every bite</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 py-8 sm:py-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-orange via-brand-pink to-brand-purple flex items-center justify-center shadow-lg shadow-brand-orange/20">
                <Flame className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="text-2xl font-black font-display tracking-tight text-white">
                CRAVO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern food-tech companion that matches what you eat with how you feel and what you want to spend. No boring restaurant lists. Pure craving satisfaction.
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Instant Moods</span>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.slice(0, 5).map(m => (
                  <Link
                    key={m.id}
                    href={`/food-mood?mood=${m.id}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 transition-colors border border-slate-800"
                  >
                    {m.emoji} {m.name.split(' ')[0]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Experience Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 sm:mb-4">Experiences</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/food-mood" className="hover:text-brand-pink transition-colors">🍱 Food Mood Discovery</Link></li>
              <li><Link href="/under-100" className="hover:text-emerald-400 transition-colors">🎯 Meals Under ₹100</Link></li>
              <li><Link href="/ai-planner" className="hover:text-purple-400 transition-colors">🧠 AI Food Planner</Link></li>
              <li><Link href="/explore" className="hover:text-blue-400 transition-colors">🧭 Explore Cravings</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">📦 Live Order Tracker</Link></li>
            </ul>
          </div>

          {/* User & Perks */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 sm:mb-4">Account & Perks</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/profile" className="hover:text-white transition-colors">👤 My Profile & Macros</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">🌟 Loyalty Levels</Link></li>
              <li><Link href="/under-100#challenge" className="hover:text-white transition-colors">🎮 Budget Challenge</Link></li>
              <li><Link href="/admin" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">⚡ Admin Portal</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 sm:mb-4">Active Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Bengaluru (Indiranagar & HSR)</li>
              <li>Mumbai (Bandra & Andheri)</li>
              <li>Delhi NCR (Connaught Place)</li>
              <li>Pune (Koregaon Park)</li>
              <li>Hyderabad (Jubilee Hills)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & ShubDeep Labs Center Button */}
        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center gap-4 text-xs text-slate-500 text-center">
          
          {/* Centered ShubDeep Labs Button */}
          <div className="flex flex-col items-center justify-center">
            <a
              href="https://shubh-deep-labs.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-brand-orange/60 shadow-lg hover:shadow-glow-orange transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-200 transition-colors">
                Crafted by
              </span>
              <span className="text-xs sm:text-sm font-black bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple bg-clip-text text-transparent group-hover:from-amber-300 group-hover:via-pink-400 group-hover:to-cyan-400 transition-all font-display">
                ShubDeep Labs 🚀
              </span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center w-full pt-2 text-slate-500 border-t border-slate-900 text-[11px] sm:text-xs">
            <p>© 2026 CRAVO Technologies Inc. Made for true food lovers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Sparkles,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Laptop,
  Headphones,
  Watch,
  Footprints,
  LayoutGrid
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    setSelectedCategory,
    setIsAIAssistantOpen,
    setCurrentView,
    currentUser,
    categories
  } = useApp();

  const promptStarters = [
    'Lightweight coding laptop with 16GB+ RAM under ₹60k',
    'Best noise cancelling headphones for campus & library',
    'Ergonomic mechanical keyboard with GaN fast charger combo',
    'Durable running shoes with responsive cushioning'
  ];

  const categoryIcons: Record<string, any> = {
    'Laptops & Computing': Laptop,
    'Audio & Acoustics': Headphones,
    'Wearables & Health': Watch,
    'Footwear & Campus Style': Footprints,
    'Workspace & Ergonomics': LayoutGrid
  };

  return (
    <div id="hero-section" className="relative border-b border-white/10 bg-[#05070B] overflow-hidden py-10 md:py-14">
      {/* Background Geometric Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* System Architecture Ticker */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-sky-500/30 text-[11px] font-mono text-sky-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>NEXORA_ENGINE: ACTIVE</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>HYBRID COLLABORATIVE + ASPECT NLP + EXPONENTIAL FORECASTING</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Autonomous, Predictive & Personalized{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-cyan-400">
              Hardware Decision Engine
            </span>
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminating e-commerce noise with transparent machine-learning recommendations,
            aspect-based sentiment review summarization, real-time demand curves, and side-by-side technical benchmarks.
          </p>
        </div>

        {/* AI Prompt Input Card */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2.5">
            <Sparkles className="w-4 h-4" />
            <span>Instant Natural Language Advisor</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div
              onClick={() => setIsAIAssistantOpen(true)}
              className="flex-1 w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex items-center justify-between cursor-pointer hover:border-sky-500/40 hover:text-slate-200 transition-all font-mono"
            >
              <span>Describe what you need (e.g., budget, battery, specs, work style)...</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                ⌘K / AI
              </span>
            </div>

            <button
              id="hero-ai-launch-btn"
              onClick={() => setIsAIAssistantOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-1.5"
            >
              <span>Ask Co-Pilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
            <span className="text-[11px] text-slate-500 font-mono">Suggested:</span>
            {promptStarters.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setIsAIAssistantOpen(true)}
                className="text-[11px] text-slate-400 hover:text-sky-300 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md border border-white/5 transition-all text-left truncate max-w-xs"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Category Quick Selector Chips */}
        <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 whitespace-nowrap transition-all"
          >
            <span>All Catalog</span>
          </button>

          {categories.map(cat => {
            const Icon = categoryIcons[cat.name] || LayoutGrid;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 hover:border-sky-500/40 text-xs font-medium text-slate-300 hover:text-sky-300 whitespace-nowrap transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-sky-400" />
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">
                  {cat.productCount}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

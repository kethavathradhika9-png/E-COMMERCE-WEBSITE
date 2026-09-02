import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { ProductCard } from './ProductCard.js';
import {
  Sparkles,
  Sliders,
  ShieldAlert,
  Trash2,
  RefreshCw,
  Cpu,
  Coins,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const PersonalizationDashboard: React.FC = () => {
  const {
    currentUser,
    updatePreferences,
    clearPrivacyData,
    recommendations,
    isLoadingRecs,
    refreshRecommendations
  } = useApp();

  const [perfWeight, setPerfWeight] = useState(currentUser?.preferences.performancePriority || 85);
  const [priceWeight, setPriceWeight] = useState(currentUser?.preferences.priceSensitivityPriority || 60);
  const [brandWeight, setBrandWeight] = useState(currentUser?.preferences.brandAffinityPriority || 20);

  const handleSaveWeights = async () => {
    await updatePreferences({
      performancePriority: perfWeight,
      priceSensitivityPriority: priceWeight,
      brandAffinityPriority: brandWeight
    });
  };

  return (
    <div id="personalization-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Glassmorphism Explainability Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRANSPARENT ALGORITHMIC PERSONALIZATION</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100">
              Personalized Recommendations for {currentUser?.name || 'You'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every recommendation score is computed mathematically in real-time from your active preferences,
              hardware benchmarks, verified review sentiment, and browsing affinity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={refreshRecommendations}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecs ? 'animate-spin' : ''}`} />
              <span>Re-Score Items</span>
            </button>

            <button
              onClick={clearPrivacyData}
              className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center justify-center gap-1.5 transition-all"
              title="Purges all behavioral activity logs under GDPR compliance"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge GDPR Telemetry</span>
            </button>
          </div>

        </div>
      </div>

      {/* Interactive Weight Adjustment Sliders Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Performance Slider */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-mono uppercase font-bold text-slate-200">
                Performance Weight
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-sky-400">{perfWeight}%</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Prioritizes top multicore CPUs, 32GB RAM, OLED displays, and thermal engineering.
          </p>

          <input
            type="range"
            min="0"
            max="100"
            value={perfWeight}
            onChange={e => setPerfWeight(parseInt(e.target.value))}
            onMouseUp={handleSaveWeights}
            onTouchEnd={handleSaveWeights}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Price Sensitivity Slider */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono uppercase font-bold text-slate-200">
                Price Value Index
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{priceWeight}%</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Maximizes discount depth, combo bundles, and price-to-performance ratio.
          </p>

          <input
            type="range"
            min="0"
            max="100"
            value={priceWeight}
            onChange={e => setPriceWeight(parseInt(e.target.value))}
            onMouseUp={handleSaveWeights}
            onTouchEnd={handleSaveWeights}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Brand Affinity Slider */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono uppercase font-bold text-slate-200">
                Brand Continuity
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400">{brandWeight}%</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Biases towards previously purchased ecosystems (Zenith, AuraSound, Apex).
          </p>

          <input
            type="range"
            min="0"
            max="100"
            value={brandWeight}
            onChange={e => setBrandWeight(parseInt(e.target.value))}
            onMouseUp={handleSaveWeights}
            onTouchEnd={handleSaveWeights}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
        </div>

      </div>

      {/* Recommended Items Grid with Explainability Reasons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Top Algorithmic Matches</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Normalized 0 - 100 Match Scores
          </span>
        </div>

        {isLoadingRecs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-slate-900/50 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(recommendations || []).map(rec => (
              <ProductCard
                key={rec.product.id}
                product={rec.product}
                matchScore={rec.matchScore}
                explainReason={rec.reasons?.[0]}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

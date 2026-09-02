import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import {
  X,
  Sparkles,
  CheckCircle2,
  Trash2,
  ShoppingCart,
  Crown,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen,
    addToCart
  } = useApp();

  const [comparisonData, setComparisonData] = useState<{
    verdict: string;
    bestFor: Record<string, string>;
    comparisonPoints: Array<{ feature: string; values: Record<string, string>; winnerId: string }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isCompareOpen || compareList.length < 2) {
      setComparisonData(null);
      return;
    }

    const runComparison = async () => {
      setIsLoading(true);
      try {
        const res = await api.compareProducts(compareList.map(p => p.id));
        setComparisonData(res);
      } catch (err) {
        console.error('Comparison error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    runComparison();
  }, [isCompareOpen, compareList]);

  if (!isCompareOpen) return null;

  return (
    <div
      id="compare-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={() => setIsCompareOpen(false)}
    >
      <div
        id="compare-modal-container"
        className="relative w-full max-w-5xl bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-100">
                Side-by-Side Hardware Comparison Matrix
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Comparing {compareList.length} devices with AI Benchmark Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {compareList.length < 2 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">
                Add at least 2 items to compare side-by-side. Browse the catalog and click the compare icon on product cards.
              </p>
            </div>
          ) : (
            <>
              {/* AI Purchase Recommendation Verdict Card */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-sky-950/60 via-indigo-950/60 to-purple-950/60 border border-sky-500/30 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                    AI Decision Verdict & Optimal Fit
                  </h3>
                </div>

                {isLoading ? (
                  <div className="py-2 space-y-1.5 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-800 rounded w-2/3" />
                  </div>
                ) : comparisonData ? (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {comparisonData.verdict}
                    </p>

                    {/* Best For Mapping */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                      {compareList.map(item => (
                        <div key={item.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-white/5">
                          <div className="text-[11px] font-mono text-sky-400 font-semibold truncate">{item.name}</div>
                          <div className="text-[11px] text-slate-300 mt-0.5">
                            👉 {comparisonData.bestFor?.[item.id] || 'Optimal for standard multitasking'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Comparison Matrix Table */}
              <div className="overflow-x-auto border border-white/10 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/60">
                      <th className="p-4 w-40 font-mono text-slate-400 uppercase text-[11px]">Specification</th>
                      {compareList.map(item => (
                        <th key={item.id} className="p-4 min-w-[200px] align-top">
                          <div className="space-y-2">
                            <div className="h-28 flex items-center justify-center p-2 bg-slate-950 rounded-lg border border-white/5">
                              <img src={(item.images && item.images[0]) || ''} alt={item.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <div className="font-mono text-[10px] text-sky-400 uppercase">{item.brand}</div>
                              <h4 className="font-semibold text-slate-100 line-clamp-2">{item.name}</h4>
                              <div className="font-heading font-bold text-sm text-slate-200 mt-1">
                                ₹{item.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                            <div className="flex gap-1.5 pt-1">
                              <button
                                onClick={() => addToCart(item, 1)}
                                className="flex-1 py-1.5 px-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-[11px] flex items-center justify-center gap-1"
                              >
                                <ShoppingCart className="w-3 h-3" /> Add
                              </button>
                              <button
                                onClick={() => removeFromCompare(item.id)}
                                className="p-1.5 rounded-md bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-white/5"
                                title="Remove"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    
                    {/* Rating */}
                    <tr>
                      <td className="p-3.5 font-mono text-slate-400">Rating & Reviews</td>
                      {compareList.map(item => (
                        <td key={item.id} className="p-3.5 font-mono text-slate-200">
                          ⭐ {item.rating} / 5.0 ({item.reviewCount} reviews)
                        </td>
                      ))}
                    </tr>

                    {/* Stock Status */}
                    <tr>
                      <td className="p-3.5 font-mono text-slate-400">Inventory</td>
                      {compareList.map(item => (
                        <td key={item.id} className="p-3.5 font-mono text-slate-200">
                          {item.stock > 0 ? (
                            <span className="text-emerald-400 font-semibold">In Stock ({item.stock})</span>
                          ) : (
                            <span className="text-rose-400">Out of Stock</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* AI Feature Points */}
                    {(comparisonData?.comparisonPoints || []).map((cp, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-mono text-slate-400 font-semibold">{cp.feature}</td>
                        {compareList.map(item => {
                          const isWinner = cp.winnerId === item.id;
                          return (
                            <td key={item.id} className={`p-3.5 ${isWinner ? 'bg-sky-950/30' : ''}`}>
                              <div className="flex items-center gap-1.5">
                                {isWinner && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                                <span className={isWinner ? 'text-sky-300 font-semibold' : 'text-slate-300'}>
                                  {cp.values?.[item.id] || item.specifications?.[cp.feature] || (item as any).attributes?.[cp.feature] || 'N/A'}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

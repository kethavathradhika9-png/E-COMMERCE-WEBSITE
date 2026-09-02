import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { IDemandForecast } from '../types.js';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  Package,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export const DemandForecastView: React.FC = () => {
  const { products } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-lap-01');
  const [forecastData, setForecastData] = useState<IDemandForecast | null>(null);
  const [platformOverview, setPlatformOverview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [pForecast, overview] = await Promise.all([
          api.getProductForecast(selectedProductId),
          api.getPlatformDemandOverview()
        ]);
        setForecastData(pForecast);
        setPlatformOverview(overview);
      } catch (err) {
        console.error('Failed to load forecast data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedProductId]);

  // Merge history and forecast data for charting
  const chartData = forecastData ? [
    ...forecastData.history.slice(-14).map(h => ({
      date: h.date.slice(5),
      actualUnits: h.units,
      predictedUnits: null,
      confidenceUpper: null,
      confidenceLower: null
    })),
    ...forecastData.forecast.map(f => ({
      date: f.date.slice(5),
      actualUnits: null,
      predictedUnits: f.units,
      confidenceUpper: f.confidenceUpper,
      confidenceLower: f.confidenceLower
    }))
  ] : [];

  return (
    <div id="demand-forecast-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100">
              Predictive Demand & Inventory Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono">
              ML // Timeseries
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Exponential smoothing with seasonal volatility adjustments and real-time elasticity modeling
          </p>
        </div>

        {/* Product Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-3 py-2">
          <Package className="w-4 h-4 text-sky-400" />
          <select
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-mono"
          >
            {products.map(p => (
              <option key={p.id} value={p.id} className="bg-slate-900">
                {p.name} ({p.brand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Strip */}
      {forecastData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="text-[11px] font-mono uppercase text-slate-400">Current Warehouse Stock</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-heading text-2xl font-bold text-slate-100">{forecastData.currentStock} Units</span>
              <span className="text-xs font-mono text-emerald-400">Hub-04 BLR</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="text-[11px] font-mono uppercase text-slate-400">7-Day Projected Velocity</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-heading text-2xl font-bold text-sky-400">+{forecastData.predictedDemand7Days} Units</span>
              <span className="text-xs font-mono text-sky-400">α = 0.35</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="text-[11px] font-mono uppercase text-slate-400">Stockout Runway</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className={`font-heading text-2xl font-bold ${
                forecastData.stockoutRisk === 'CRITICAL' ? 'text-rose-400' : forecastData.stockoutRisk === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {forecastData.daysUntilStockout} Days
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                forecastData.stockoutRisk === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {forecastData.stockoutRisk} RISK
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="text-[11px] font-mono uppercase text-slate-400">Automated Reorder Point</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-heading text-2xl font-bold text-slate-100">≤ {forecastData.reorderPoint} Units</span>
              <span className="text-xs font-mono text-indigo-400">Lot: {forecastData.recommendedOrderQuantity}</span>
            </div>
          </div>

        </div>
      )}

      {/* Main Timeseries Forecast Chart (Recharts) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Historical Orders (14-Day) vs 7-Day ML Forecast Projection</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Solid Cyan: Verified Units Sold • Dashed Violet: Predicted Demand Curve with 90% Confidence Interval
            </p>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#F1F5F9' }}
              />
              <Area type="monotone" dataKey="actualUnits" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#actualGradient)" name="Actual Units" />
              <Area type="monotone" dataKey="predictedUnits" stroke="#818CF8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#predictedGradient)" name="Predicted Units" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Pricing Engine & Category Growth Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dynamic Pricing Recommendation */}
        {forecastData && (
          <div className="p-6 rounded-xl bg-slate-900/80 border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="font-heading font-bold text-sm text-slate-100">
                Dynamic Pricing & Elasticity Engine
              </h3>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Current Catalog Price:</span>
                <span className="font-bold text-slate-200 font-mono">₹{forecastData.dynamicPricing.currentPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">AI Recommended Optimal Price:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">₹{forecastData.dynamicPricing.optimalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Estimated Price Elasticity (E):</span>
                <span className="font-bold text-sky-400 font-mono">{forecastData.elasticity}</span>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-300 font-mono">
                💡 <span className="text-sky-300 font-semibold">Strategy Note:</span> {forecastData.dynamicPricing.strategy}
              </div>
            </div>
          </div>
        )}

        {/* Category Demand Velocity Table */}
        {platformOverview && (
          <div className="p-6 rounded-xl bg-slate-900/80 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Platform Category Demand Distribution</span>
            </h3>

            <div className="space-y-2">
              {platformOverview.categoryDemand?.map((cat: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs">
                  <span className="font-semibold text-slate-200">{cat.category}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">{cat.totalUnits} units</span>
                    <span className="text-emerald-400 font-bold">{cat.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

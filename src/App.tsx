/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { ProductCatalog } from './components/ProductCatalog.js';
import { PersonalizationDashboard } from './components/PersonalizationDashboard.js';
import { DemandForecastView } from './components/DemandForecastView.js';
import { OrderTrackerView } from './components/OrderTrackerView.js';
import { AdminProductManager } from './components/AdminProductManager.js';
import { ProductDetailModal } from './components/ProductDetailModal.js';
import { CompareModal } from './components/CompareModal.js';
import { CartDrawer } from './components/CartDrawer.js';
import { AIAssistantDrawer } from './components/AIAssistantDrawer.js';
import { ToastContainer } from './components/Toast.js';
import {
  Zap,
  Cpu,
  ShieldCheck,
  Sparkles,
  GitBranch,
  Terminal,
  Layers,
  Heart
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#05070B] text-slate-200">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Dynamic Views */}
      <div className="flex-1">
        {currentView === 'CATALOG' && (
          <>
            <HeroSection />
            <ProductCatalog />
          </>
        )}

        {currentView === 'RECOMMENDATIONS' && <PersonalizationDashboard />}

        {currentView === 'DEMAND_FORECAST' && <DemandForecastView />}

        {currentView === 'ORDERS' && <OrderTrackerView />}

        {currentView === 'ADMIN' && <AdminProductManager />}

        {currentView === 'PROFILE' && <PersonalizationDashboard />}
      </div>

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CompareModal />
      <CartDrawer />
      <AIAssistantDrawer />
      <ToastContainer />

      {/* Geometric Balance Footer */}
      <footer className="border-t border-white/10 bg-[#030408] text-xs text-slate-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">
            
            {/* Brand Column */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <span className="font-heading font-bold text-base text-slate-100">NEXORA AI</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Autonomous, personalized hardware decision engine. Built with hybrid machine learning, aspect-based sentiment NLP, and time-series forecasting.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ALL AI SERVICES OPERATIONAL</span>
              </div>
            </div>

            {/* Platform Navigation */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-mono uppercase font-bold text-slate-200">Architecture</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setCurrentView('CATALOG')} className="hover:text-sky-400">Hardware Catalog</button></li>
                <li><button onClick={() => setCurrentView('RECOMMENDATIONS')} className="hover:text-sky-400">Transparent Personalization</button></li>
                <li><button onClick={() => setCurrentView('DEMAND_FORECAST')} className="hover:text-sky-400">Exponential Smoothing Forecast</button></li>
                <li><button onClick={() => setCurrentView('ORDERS')} className="hover:text-sky-400">Real-Time Logistics Tracker</button></li>
              </ul>
            </div>

            {/* AI & ML Models */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-mono uppercase font-bold text-slate-200">AI / ML Intelligence</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                <li>• Hybrid Collaborative Filtering</li>
                <li>• Aspect-Based NLP Sentiment</li>
                <li>• Price Elasticity Modeling (E)</li>
                <li>• Gemini 2.5 Flash Assistant</li>
              </ul>
            </div>

            {/* Security & GDPR */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-mono uppercase font-bold text-slate-200">Privacy & Standards</h4>
              <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GDPR / DPDP Ready</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Zero third-party tracking. Behavioral telemetry can be purged instantly via Profile controls.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Tech Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
            <div>
              © 2026 NEXORA Intelligent Commerce Platform • B.Tech Engineering Capstone Project
            </div>
            <div className="flex items-center gap-4">
              <span>TypeScript</span>
              <span>•</span>
              <span>Express + Vite</span>
              <span>•</span>
              <span>Recharts</span>
              <span>•</span>
              <span>Gemini AI</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

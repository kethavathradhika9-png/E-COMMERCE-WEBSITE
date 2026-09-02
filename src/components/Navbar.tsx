import React from 'react';
import { useApp, AppView } from '../context/AppContext.js';
import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Layers,
  TrendingUp,
  Package,
  ShieldCheck,
  Zap,
  User,
  GitCompare
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    cartItemCount,
    setIsCartOpen,
    compareList,
    setIsCompareOpen,
    setIsAIAssistantOpen,
    currentUser
  } = useApp();

  const navItems: Array<{ view: AppView; label: string; icon: any; badge?: string }> = [
    { view: 'CATALOG', label: 'Catalog', icon: Layers },
    { view: 'RECOMMENDATIONS', label: 'For You', icon: Sparkles, badge: 'AI' },
    { view: 'DEMAND_FORECAST', label: 'Demand Forecast', icon: TrendingUp, badge: 'ML' },
    { view: 'ORDERS', label: 'My Orders', icon: Package },
    { view: 'ADMIN', label: 'Admin Ops', icon: ShieldCheck }
  ];

  return (
    <header id="main-navbar" className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#05070B]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6">
            <button
              id="navbar-brand-logo"
              onClick={() => setCurrentView('CATALOG')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 via-indigo-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-lg tracking-wider text-slate-100">
                    NEXORA
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    AI // v3.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
                  Predictive Commerce Engine
                </p>
              </div>
            </button>

            {/* Main Navigation Links */}
            <nav id="navbar-nav-links" className="hidden md:flex items-center gap-1 border-l border-white/10 pl-6">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    id={`nav-link-${item.view.toLowerCase()}`}
                    onClick={() => setCurrentView(item.view)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/10 text-sky-400 border border-sky-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                        isActive ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search specs, 32GB RAM, OLED, noise cancellation, shoes..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/50 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  id="navbar-search-clear"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
                >
                  ESC
                </button>
              )}
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2">
            
            {/* AI Assistant Drawer Trigger */}
            <button
              id="navbar-ai-assistant-btn"
              onClick={() => setIsAIAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-purple-600/30 border border-sky-500/40 text-sky-300 hover:text-white hover:border-sky-400 text-xs font-semibold shadow-lg shadow-sky-950 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="hidden sm:inline">Ask AI Co-Pilot</span>
            </button>

            {/* Compare Tray Trigger */}
            <button
              id="navbar-compare-tray-btn"
              onClick={() => setIsCompareOpen(true)}
              className={`relative p-2 rounded-lg border text-xs transition-all ${
                compareList.length > 0
                  ? 'border-indigo-500/50 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50'
                  : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Compare Tray"
            >
              <GitCompare className="w-4 h-4" />
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-500 text-slate-950 rounded-full font-bold text-[10px] flex items-center justify-center shadow">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              id="navbar-cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg border border-white/10 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 text-sky-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-sky-500 text-slate-950 rounded-full font-bold text-[10px] flex items-center justify-center shadow">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Explainability Switcher */}
            <button
              id="navbar-profile-btn"
              onClick={() => setCurrentView('PROFILE')}
              className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                currentView === 'PROFILE'
                  ? 'border-sky-500/50 bg-sky-950/40 text-sky-300'
                  : 'border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5'
              }`}
              title="User Profile & Explainability Engine"
            >
              <div className="w-6 h-6 rounded-md bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-sky-400">
                {currentUser?.name ? currentUser.name[0] : 'K'}
              </div>
              <span className="text-xs font-medium hidden xl:inline pr-1">
                {currentUser?.name.split(' ')[0] || 'Karan'}
              </span>
            </button>

          </div>

        </div>

        {/* Mobile View Navigation Tab Strip */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-white/5 gap-2 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { ProductCard } from './ProductCard.js';
import {
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  Search,
  Check
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedBadge,
    setSelectedBadge,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const badges = ['All', 'AI Choice', 'Best Seller', 'Editor Pick', 'Top Rated'];

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBadge('');
    setPriceRange([0, 150000]);
    setSortBy('featured');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedBadge !== '' ||
    priceRange[0] > 0 ||
    priceRange[1] < 150000 ||
    searchQuery !== '';

  return (
    <div id="product-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Catalog Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        
        {/* Title & Count */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100">
              {selectedCategory === 'All' ? 'Hardware & Gear Catalog' : selectedCategory}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-slate-400">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inventory backed by predictive demand algorithms & verified customer telemetry
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900 text-slate-300 text-xs font-medium"
          >
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Sort:</span>
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-mono"
            >
              <option value="featured" className="bg-slate-900">Featured (AI Match)</option>
              <option value="rating" className="bg-slate-900">Highest Rated</option>
              <option value="popularity" className="bg-slate-900">Most Popular</option>
              <option value="price-low" className="bg-slate-900">Price: Low to High</option>
              <option value="price-high" className="bg-slate-900">Price: High to Low</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/10 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/10 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 bg-sky-950/40 border border-sky-500/30 px-2.5 py-1.5 rounded-lg transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* Main Grid Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        
        {/* Filter Sidebar */}
        <aside className={`md:block ${isFilterDrawerOpen ? 'block' : 'hidden'} md:col-span-1 space-y-6`}>
          
          {/* Categories */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-3">
              Categories
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-semibold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>All Categories</span>
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-semibold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Badges Filter */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-3">
              Special Curation
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {badges.map(badge => {
                const isActive = badge === 'All' ? selectedBadge === '' : selectedBadge === badge;
                return (
                  <button
                    key={badge}
                    onClick={() => setSelectedBadge(badge === 'All' ? '' : badge)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                      isActive
                        ? 'bg-sky-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-950 border border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {badge}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400">
                Max Price
              </h4>
              <span className="text-xs font-mono font-bold text-sky-400">
                ₹{priceRange[1].toLocaleString('en-IN')}
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="150000"
              step="2000"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>₹1,000</span>
              <span>₹1,50,000+</span>
            </div>
          </div>

        </aside>

        {/* Products Grid / Listing */}
        <main className="md:col-span-3 lg:col-span-4">
          
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-slate-900/50 border border-white/5 animate-pulse p-4 flex flex-col justify-between">
                  <div className="h-44 bg-slate-800/50 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800/50 rounded w-3/4" />
                    <div className="h-3 bg-slate-800/40 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-white/10 text-center flex flex-col items-center justify-center">
              <Search className="w-10 h-10 text-slate-600 mb-3" />
              <h3 className="font-heading text-lg font-bold text-slate-200">No hardware found</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                No items match your active search and filter constraints. Try expanding the price bracket or clearing keywords.
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-5`}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};

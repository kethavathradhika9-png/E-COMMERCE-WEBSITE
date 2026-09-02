import React, { useState, useEffect } from 'react';
import { IProduct, IReview, IReviewSummary } from '../types.js';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  GitCompare,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Cpu,
  Layers
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    compareList,
    currentUser,
    addToast
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<IReviewSummary | null>(null);
  const [bundle, setBundle] = useState<{ items: IProduct[]; comboPrice: number; discountSavings: number } | null>(null);
  const [similarItems, setSimilarItems] = useState<IProduct[]>([]);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);

  // New Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newHeadline, setNewHeadline] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!selectedProduct) return;

    setActiveImageIdx(0);
    setIsLoadingAnalysis(true);

    const loadDetails = async () => {
      try {
        const [revs, sum, bndl, sim] = await Promise.all([
          api.getReviews(selectedProduct.id),
          api.getReviewSummary(selectedProduct.id),
          api.getBundle(selectedProduct.id),
          api.getSimilar(selectedProduct.id)
        ]);
        setReviews(revs);
        setReviewSummary(sum);
        setBundle(bndl);
        setSimilarItems(sim);
      } catch (err) {
        console.error('Error fetching product deep details:', err);
      } finally {
        setIsLoadingAnalysis(false);
      }
    };

    loadDetails();
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const isLiked = isInWishlist(selectedProduct.id);
  const isCompared = compareList.some(p => p.id === selectedProduct.id);

  const handleAddBundleToCart = () => {
    if (!bundle) return;
    bundle.items.forEach(item => addToCart(item, 1));
    addToast({
      type: 'success',
      title: 'Bundle Added!',
      message: `Added all ${bundle.items.length} complementary items with ₹${bundle.discountSavings.toLocaleString('en-IN')} savings.`
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadline.trim() || !newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const added = await api.addReview({
        productId: selectedProduct.id,
        userId: currentUser?.id || 'usr-demo-01',
        userName: currentUser?.name || 'Verified Tech Buyer',
        rating: newRating,
        headline: newHeadline,
        comment: newComment,
        verifiedPurchase: true
      });
      setReviews(prev => [added, ...prev]);
      setNewHeadline('');
      setNewComment('');
      addToast({
        type: 'success',
        title: 'Review Published',
        message: 'Thank you! Your feedback helps calibrate the recommendation engine.'
      });
    } catch (e) {
      addToast({ type: 'error', title: 'Submission Error', message: 'Could not post review.' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={() => setSelectedProduct(null)}
    >
      <div
        id="product-detail-modal-container"
        className="relative w-full max-w-5xl bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-sky-400 font-semibold">
              {selectedProduct.category}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-400">{selectedProduct.brand}</span>
          </div>

          <button
            id="product-detail-close-btn"
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* Top Section: Images + Purchase Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-xl bg-slate-950 border border-white/10 overflow-hidden p-4 flex items-center justify-center relative">
                <img
                  src={(selectedProduct.images && (selectedProduct.images[activeImageIdx] || selectedProduct.images[0])) || ''}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Thumbnails */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex gap-2">
                  {selectedProduct.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-16 h-16 rounded-lg bg-slate-950 border p-1 overflow-hidden transition-all ${
                        activeImageIdx === i ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Product Overview & Buy Box */}
            <div className="space-y-5 flex flex-col justify-between">
              <div>
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-100">
                  {selectedProduct.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-amber-400 font-mono text-xs">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-sm">{selectedProduct.rating}</span>
                    <span className="text-slate-400">({reviews.length} reviews)</span>
                  </div>

                  <div className="h-3 w-[1px] bg-white/10" />

                  <span className={`text-xs font-mono font-semibold ${selectedProduct.stock > 10 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} units available)` : 'Currently Out of Stock'}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-heading text-3xl font-bold text-slate-100">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span className="text-sm line-through text-slate-500 font-mono">
                        ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        SAVE ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Delivery & Warranty Guarantees */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950 border border-white/5">
                    <Truck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span>Free HyperExpress</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950 border border-white/5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>2-Yr Warranty</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950 border border-white/5">
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>7-Day Replacement</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={() => addToCart(selectedProduct, 1)}
                    disabled={selectedProduct.stock <= 0}
                    className="flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    id="modal-wishlist-btn"
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-3 rounded-xl border transition-all ${
                      isLiked ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
                  </button>

                  <button
                    id="modal-compare-btn"
                    onClick={() => addToCompare(selectedProduct)}
                    className={`p-3 rounded-xl border transition-all ${
                      isCompared ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Technical Specifications Grid */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-white/10">
            <h3 className="text-sm font-heading font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Full Technical Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(selectedProduct.specifications || {}).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5">
                  <div className="text-[11px] text-slate-500 font-mono">{key}</div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspect-Based AI Sentiment Summary */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-sky-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-heading font-bold text-slate-100">
                  Aspect-Based Review Sentiment & AI Consensus
                </h3>
              </div>
              {reviewSummary && (
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950 px-2.5 py-1 rounded-md border border-sky-500/30">
                  {reviewSummary.sentimentScore}% POSITIVE CONSENSUS
                </span>
              )}
            </div>

            {isLoadingAnalysis ? (
              <div className="space-y-2 py-4 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ) : reviewSummary ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5">
                  {reviewSummary.summary}
                </p>

                {/* Pros & Cons Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Key Advantages
                    </span>
                    {reviewSummary.pros.map((pro, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start gap-2 pl-1">
                        <span className="text-emerald-400">•</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Considerations
                    </span>
                    {reviewSummary.cons.map((con, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start gap-2 pl-1">
                        <span className="text-amber-400">•</span>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aspect Sentiment Breakdown Bars */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
                    Telemetry by Hardware Dimension:
                  </span>

                  <div className="space-y-2.5">
                    {reviewSummary.aspectBreakdown.map((asp, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300 font-semibold">{asp.aspect}</span>
                          <span className="text-sky-400">{asp.positivePercentage}% positive</span>
                        </div>
                        
                        {/* 3-Color Sentiment Bar */}
                        <div className="h-1.5 w-full bg-slate-800 rounded-full flex overflow-hidden">
                          <div style={{ width: `${asp.positivePercentage}%` }} className="bg-emerald-500 h-full" />
                          <div style={{ width: `${asp.neutralPercentage}%` }} className="bg-amber-500 h-full" />
                          <div style={{ width: `${asp.negativePercentage}%` }} className="bg-rose-500 h-full" />
                        </div>
                        <p className="text-[11px] text-slate-400 italic">{asp.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : null}
          </div>

          {/* Frequently Bought Together Bundle */}
          {bundle && bundle.items.length > 1 && (
            <div className="p-5 rounded-xl bg-slate-950/80 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-heading font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Frequently Bought Together (12% Combo Savings)</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Save ₹{bundle.discountSavings.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {(bundle.items || []).map((bItem, idx) => (
                    <React.Fragment key={bItem.id}>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-white/5 max-w-[200px]">
                        <img src={(bItem.images && bItem.images[0]) || ''} alt={bItem.name} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                        <div className="text-[11px] truncate">
                          <div className="font-semibold text-slate-200 truncate">{bItem.name}</div>
                          <div className="font-mono text-sky-400">₹{bItem.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      {idx < bundle.items.length - 1 && (
                        <Plus className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  onClick={handleAddBundleToCart}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap transition-all shadow-md"
                >
                  Buy Bundle (₹{bundle.comboPrice.toLocaleString('en-IN')})
                </button>
              </div>
            </div>
          )}

          {/* Verified Customer Reviews & Write Review Form */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-heading font-bold text-slate-100">
              Verified Customer Reviews ({reviews.length})
            </h3>

            {/* Write Review Form */}
            <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
              <div className="text-xs font-semibold text-slate-200">Write a Verified Review</div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={newHeadline}
                onChange={e => setNewHeadline(e.target.value)}
                placeholder="Headline (e.g. Great compilation speeds for Android Studio)"
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50"
                required
              />

              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your detailed experience regarding performance, battery, build quality, and comfort..."
                rows={3}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50"
                required
              />

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingReview ? 'Analyzing & Posting...' : 'Submit Review'}</span>
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-sky-400">
                        {rev.userName[0]}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          VERIFIED
                        </span>
                      )}
                    </div>

                    <div className="flex text-amber-400 text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100">{rev.headline}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle,
  Truck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    currentUser,
    placeOrder,
    setCurrentView,
    addToast
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState<'EXPRESS' | 'STANDARD'>('EXPRESS');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'NEXORA1000') {
      setAppliedDiscount(1000);
      setAppliedCoupon('NEXORA1000');
      addToast({ type: 'success', title: 'Coupon Applied!', message: '₹1,000 instant discount deducted.' });
    } else if (code === 'CAMPUS10') {
      const disc = Math.round(cartTotal * 0.10);
      setAppliedDiscount(disc);
      setAppliedCoupon('CAMPUS10');
      addToast({ type: 'success', title: 'Campus Discount!', message: `10% discount (-₹${disc.toLocaleString('en-IN')}) applied.` });
    } else {
      addToast({ type: 'error', title: 'Invalid Code', message: 'Try "NEXORA1000" or "CAMPUS10"' });
    }
  };

  const finalTax = Math.round(cartTotal * 0.05);
  const shippingCost = deliverySpeed === 'EXPRESS' ? 0 : 0; // Free for demo
  const finalTotal = Math.max(0, cartTotal + finalTax - appliedDiscount);

  const handleProceedToCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const order = await placeOrder({
        discount: appliedDiscount,
        couponCode: appliedCoupon,
        shipping: shippingCost,
        deliverySpeed,
        shippingAddress: currentUser?.address,
        paymentMethod: 'UPI'
      });

      setIsCartOpen(false);
      setCurrentView('ORDERS');
      addToast({
        type: 'success',
        title: 'Order Placed Successfully!',
        message: `Order #${order.orderNumber} is now moving to fulfillment center.`
      });
    } catch (e) {
      addToast({ type: 'error', title: 'Checkout Failed', message: 'Could not process order.' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#080C14] border-l border-white/15 h-full shadow-2xl flex flex-col justify-between"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-sky-400" />
            <h3 className="font-heading font-bold text-base text-slate-100">Shopping Cart</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-slate-400">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="font-heading font-bold text-slate-300">Your bag is empty</h4>
              <p className="text-xs text-slate-500 mt-1">Discover high-performance hardware and accessories in our catalog.</p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-3"
              >
                <img
                  src={(item.product.images && item.product.images[0]) || ''}
                  alt={item.product.name}
                  className="w-14 h-14 object-contain rounded-lg bg-slate-950 p-1"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 text-xs truncate">
                  <div className="font-semibold text-slate-100 truncate">{item.product.name}</div>
                  <div className="font-mono text-sky-400 font-bold mt-0.5">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded bg-slate-950 border border-white/10 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs text-slate-200 font-bold px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded bg-slate-950 border border-white/10 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-slate-950/90 space-y-3">
            
            {/* Coupon Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Code: NEXORA1000 or CAMPUS10"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 uppercase font-mono focus:outline-none focus:border-sky-500/50"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold"
              >
                Apply
              </button>
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs font-mono text-slate-400 pt-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-slate-200">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon}):</span>
                  <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (GST 5%):</span>
                <span className="text-slate-200">₹{finalTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Airway Courier Delivery:</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-100 font-bold text-sm pt-2 border-t border-white/10">
                <span>Grand Total:</span>
                <span className="text-sky-400">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Instant Checkout Button */}
            <button
              id="cart-instant-checkout-btn"
              onClick={handleProceedToCheckout}
              disabled={isCheckingOut}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
            >
              <span>{isCheckingOut ? 'Authorizing & Dispatching...' : `Pay ₹${finalTotal.toLocaleString('en-IN')} via UPI`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit Encrypted Checkout • Instant Airway Dispatch</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

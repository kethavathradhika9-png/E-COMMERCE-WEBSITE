import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { IOrder } from '../types.js';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Search,
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const OrderTrackerView: React.FC = () => {
  const { orders, addToast } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || 'ord-1001');
  const [searchCode, setSearchCode] = useState<string>('');

  const currentOrder = orders.find(o => o.id === selectedOrderId || o.orderNumber === selectedOrderId) || orders[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({ type: 'success', title: 'Copied', message: `Tracking code ${text} copied to clipboard!` });
  };

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o =>
      o.orderNumber.toLowerCase() === searchCode.toLowerCase() ||
      o.trackingNumber?.toLowerCase() === searchCode.toLowerCase()
    );
    if (found) {
      setSelectedOrderId(found.id);
      addToast({ type: 'success', title: 'Order Found', message: `Displaying timeline for ${found.orderNumber}` });
    } else {
      addToast({ type: 'error', title: 'Not Found', message: 'No active shipment found with that tracking code.' });
    }
  };

  return (
    <div id="order-tracker-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-sky-400" />
            <span>Order History & Real-Time Logistics Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track package milestones, delivery estimates, and airway bill updates in real time.
          </p>
        </div>

        {/* Search Order / Tracking Number Form */}
        <form onSubmit={handleSearchOrder} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              placeholder="Enter Order # or Tracking Code..."
              className="bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 font-mono w-64"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold"
          >
            Track
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/40 border border-white/10">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-slate-200">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Browse the catalog, add products to cart, and place an order to see live tracking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Order Selector List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">Your Orders</h3>
            {orders.map(ord => {
              const isSelected = ord.id === currentOrder?.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500/50 shadow-md'
                      : 'bg-slate-900/60 border-white/10 hover:bg-slate-900 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400">{ord.orderNumber}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      ord.orderStatus === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-300">
                    {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} • ₹{ord.total.toLocaleString('en-IN')}
                  </div>

                  <div className="mt-1 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                    <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Order Real-Time Timeline & Item Details */}
          {currentOrder && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Status Hero Card */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div>
                    <div className="text-xs font-mono text-slate-400">ORDER IDENTIFIER</div>
                    <div className="text-base font-bold font-mono text-slate-100">{currentOrder.orderNumber}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentOrder.trackingNumber && (
                      <button
                        onClick={() => handleCopy(currentOrder.trackingNumber!)}
                        className="px-3 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
                      >
                        <span>AWB: {currentOrder.trackingNumber}</span>
                        <Copy className="w-3 h-3 text-sky-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Milestone Progress Timeline */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Fulfillment Milestones
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                    {currentOrder.timeline.map((stage, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          stage.completed
                            ? 'bg-emerald-500 border-emerald-400'
                            : stage.current
                            ? 'bg-sky-500 border-sky-300 animate-pulse'
                            : 'bg-slate-900 border-slate-700'
                        }`}>
                          {stage.completed && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className={`text-xs font-semibold ${stage.current ? 'text-sky-300' : stage.completed ? 'text-slate-200' : 'text-slate-500'}`}>
                              {stage.title}
                            </h5>
                            {stage.timestamp && (
                              <span className="text-[10px] font-mono text-slate-500">
                                {new Date(stage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{stage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Items & Shipping Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Items in Package */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Items in Shipment
                  </h4>

                  <div className="space-y-2.5">
                    {currentOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-950 border border-white/5">
                        <img src={it.image} alt={it.productName} className="w-10 h-10 object-contain rounded bg-slate-900" referrerPolicy="no-referrer" />
                        <div className="flex-1 text-xs">
                          <div className="font-semibold text-slate-200 truncate">{it.productName}</div>
                          <div className="font-mono text-slate-400">Qty: {it.quantity} • ₹{it.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1 text-xs font-mono text-slate-300">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span>₹{currentOrder.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {currentOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount ({currentOrder.couponCode || 'PROMO'}):</span>
                        <span>-₹{currentOrder.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>Tax (GST 5%):</span>
                      <span>₹{currentOrder.tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-100 font-bold pt-1 border-t border-white/5 text-sm">
                      <span>Total Paid:</span>
                      <span className="text-sky-400">₹{currentOrder.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>Shipping Destination</span>
                  </h4>

                  <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3.5 rounded-lg border border-white/5">
                    <div className="font-bold text-slate-100">{currentOrder.shippingAddress.fullName}</div>
                    <div>{currentOrder.shippingAddress.street}</div>
                    <div>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.zipCode}</div>
                    <div className="font-mono text-slate-400 pt-1">Phone: {currentOrder.shippingAddress.phone}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/20 text-xs font-mono text-sky-300">
                    🚀 Delivery Method: <span className="font-bold">{currentOrder.deliverySpeed} AIR COURIER</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

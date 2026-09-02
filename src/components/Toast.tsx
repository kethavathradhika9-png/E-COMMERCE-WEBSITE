import React from 'react';
import { useApp } from '../context/AppContext.js';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        let Icon = Info;
        let colorClass = 'border-sky-500/30 bg-slate-900/95 text-sky-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClass = 'border-emerald-500/30 bg-slate-900/95 text-emerald-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClass = 'border-amber-500/30 bg-slate-900/95 text-amber-400';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'border-rose-500/30 bg-slate-900/95 text-rose-400';
        }

        return (
          <div
            key={toast.id}
            id={`toast-item-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${colorClass} shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-semibold text-slate-100 text-sm mb-0.5">{toast.title}</h4>
              <p className="text-slate-300 leading-relaxed">{toast.message}</p>
            </div>
            <button
              id={`toast-close-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

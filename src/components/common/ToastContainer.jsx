import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-blue-200 bg-white/95 text-slate-800';
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-200 bg-emerald-50/95 text-emerald-950 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-100';
          iconColor = 'text-emerald-600 dark:text-emerald-400';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-red-200 bg-red-50/95 text-red-950 dark:bg-red-950/80 dark:border-red-800 dark:text-red-100';
          iconColor = 'text-red-600 dark:text-red-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-200 bg-amber-50/95 text-amber-950 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-100';
          iconColor = 'text-amber-600 dark:text-amber-400';
        } else {
          borderClass = 'border-slate-200 bg-white/95 text-slate-900 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-100';
          iconColor = 'text-blue-600 dark:text-blue-400';
        }

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold leading-5">{toast.title}</p>
              )}
              <p className="text-xs leading-4 mt-0.5 opacity-90 break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;

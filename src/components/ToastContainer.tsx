import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isWarn = t.type === 'warning';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-semibold animate-slideUp transition-all ${
              isSuccess
                ? 'bg-[#2A1C14] border-[#C6A052] text-[#F4F1EA]'
                : isWarn
                ? 'bg-amber-950 border-amber-500 text-amber-100'
                : isError
                ? 'bg-red-950 border-red-500 text-red-100'
                : 'bg-[#36261C] border-blue-500/50 text-blue-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#C6A052] shrink-0" />}
              {isWarn && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {isError && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {!isSuccess && !isWarn && !isError && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 opacity-70 hover:opacity-100 text-[#A39B94]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
